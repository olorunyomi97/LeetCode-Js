from __future__ import annotations

from typing import Dict, Any


def build_zpl_for_label(state: Dict[str, Any]) -> str:
    lot = str(state.get("lot_code", "")).upper()
    unit = str(state.get("unit_number", ""))
    net_lbs = state.get("net_lbs", "")
    gross_lbs = state.get("gross_lbs", "")
    tare_lbs = state.get("tare_lbs", "")
    material = "NYLON 6"

    lines = [
        "^XA",
        "^PW812",
        "^LL1218",
        "^LH20,20",
        "^CI28",
        "^FO0,0^A0N,40,40^FDNYLENE CANADA^FS",
        f"^FO0,80^FB772,1,0,C,0^A0N,120,120^FD{lot}^FS",
        f"^FO0,240^A0N,36,36^FDGROSS WT/^FS^FO210,240^A0N,36,36^FD{_fmt_kg(gross_lbs)} KGS^FS^FO520,240^A0N,36,36^FD{gross_lbs} LBS^FS",
        f"^FO0,290^A0N,36,36^FDNET WT/^FS^FO210,290^A0N,36,36^FD{_fmt_kg(net_lbs)} KGS^FS^FO520,290^A0N,36,36^FD{net_lbs} LBS^FS",
        f"^FO0,340^A0N,36,36^FDTARE WT/^FS^FO210,340^A0N,36,36^FD{_fmt_kg(tare_lbs)} KGS^FS^FO520,340^A0N,36,36^FD{tare_lbs} LBS^FS",
        f"^FO0,400^A0N,36,36^FD{material}^FS",
        f"^FO0,460^A0N,60,60^FD{unit}^FS",
        f"^FO0,540^BY3,2,120^BCN,120,Y,N,N^FD{unit}^FS",
        "^XZ",
    ]
    return "".join(lines)


def _fmt_kg(pounds_str: str) -> str:
    try:
        pounds = float(pounds_str)
    except Exception:
        return ""
    kg = pounds * 0.45359237
    return f"{kg:,.1f}"