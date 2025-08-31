from __future__ import annotations

import json
import os
import random
import socket
import string
from datetime import datetime
from pathlib import Path
from typing import Dict, Any

from dotenv import load_dotenv
from flask import Flask, render_template, request, redirect, url_for, session, flash, jsonify

from .zpl import build_zpl_for_label


load_dotenv()

APP_SECRET = os.environ.get("APP_SECRET", "dev-secret-change-me")
PRINTER_HOST = os.environ.get("PRINTER_HOST", "127.0.0.1")
PRINTER_PORT = int(os.environ.get("PRINTER_PORT", "9100"))
HISTORY_PATH = Path(os.environ.get("HISTORY_PATH", "/workspace/data/history.jsonl"))
HISTORY_PATH.parent.mkdir(parents=True, exist_ok=True)


def create_app() -> Flask:
    app = Flask(__name__)
    app.secret_key = APP_SECRET

    @app.template_filter("kg")
    def to_kg_filter(value: float | int | str) -> str:
        try:
            pounds = float(value)
        except Exception:
            return ""
        kg = pounds * 0.45359237
        return f"{kg:,.1f}"

    @app.get("/")
    def index():
        state = session.get("label_state", {})
        return render_template("index.html", state=state)

    @app.post("/choose")
    def choose_source():
        source_type = request.form.get("source_type")
        source_value = request.form.get("source_value")
        if not source_type or not source_value:
            flash("Choose a source and an option to continue.", "error")
            return redirect(url_for("index"))
        state = session.get("label_state", {})
        state.update({"source_type": source_type, "source_value": source_value})
        session["label_state"] = state
        return redirect(url_for("weights"))

    @app.get("/weights")
    def weights():
        state = session.get("label_state", {})
        return render_template("weights.html", state=state)

    @app.post("/weights")
    def save_weights():
        state = session.get("label_state", {})
        net = request.form.get("net") or ""
        gross = request.form.get("gross") or ""
        tare = request.form.get("tare") or ""

        def norm(v: str) -> str:
            try:
                return str(round(float(v), 1))
            except Exception:
                return ""

        state.update({
            "net_lbs": norm(net),
            "gross_lbs": norm(gross),
            "tare_lbs": norm(tare),
        })
        if not state.get("unit_number"):
            state["unit_number"] = generate_unit_number()
        if not state.get("lot_code"):
            state["lot_code"] = generate_lot_code()
        session["label_state"] = state
        return redirect(url_for("preview"))

    @app.get("/preview")
    def preview():
        state = session.get("label_state", {})
        if not state:
            return redirect(url_for("index"))
        return render_template("preview.html", state=state)

    @app.post("/print")
    def print_label():
        state = session.get("label_state", {})
        if not state:
            flash("Nothing to print yet.", "error")
            return redirect(url_for("index"))
        zpl = build_zpl_for_label(state)
        try:
            send_to_printer(zpl)
            save_history_entry({
                "timestamp": datetime.utcnow().isoformat() + "Z",
                **state,
            })
            flash("Label sent to printer.", "success")
        except Exception as exc:
            flash(f"Printing failed: {exc}", "error")
        return redirect(url_for("preview"))

    @app.get("/history")
    def history():
        entries = list(load_history())[::-1][:100]
        return render_template("history.html", entries=entries)

    @app.post("/reprint")
    def reprint():
        idx = request.form.get("index")
        if idx is None:
            return redirect(url_for("history"))
        entries = list(load_history())
        try:
            entry = entries[int(idx)]
        except Exception:
            flash("Invalid entry.", "error")
            return redirect(url_for("history"))
        zpl = build_zpl_for_label(entry)
        try:
            send_to_printer(zpl)
            flash("Reprint sent.", "success")
        except Exception as exc:
            flash(f"Reprint failed: {exc}", "error")
        return redirect(url_for("history"))

    @app.post("/clear")
    def clear():
        session.pop("label_state", None)
        return redirect(url_for("index"))

    @app.get("/health")
    def health():
        return jsonify({"ok": True})

    return app


def generate_unit_number() -> str:
    today = datetime.now().strftime("%y%m%d")
    suffix = ''.join(random.choices(string.digits, k=5))
    return f"BC{today}{suffix}"


def generate_lot_code() -> str:
    letters = string.ascii_uppercase
    parts = [
        ''.join(random.choices(letters, k=2)),
        random.choice(string.digits),
        ''.join(random.choices(letters, k=3)),
        ''.join(random.choices(string.digits, k=3)),
    ]
    return ''.join(parts)


def send_to_printer(zpl: str) -> None:
    host = PRINTER_HOST
    port = PRINTER_PORT
    with socket.create_connection((host, port), timeout=5) as sock:
        sock.sendall(zpl.encode("utf-8"))


def save_history_entry(entry: Dict[str, Any]) -> None:
    with HISTORY_PATH.open("a", encoding="utf-8") as f:
        f.write(json.dumps(entry) + "\n")


def load_history():
    if not HISTORY_PATH.exists():
        return []
    with HISTORY_PATH.open("r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            try:
                yield json.loads(line)
            except Exception:
                continue


if __name__ == "__main__":
    app = create_app()
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)), debug=True)