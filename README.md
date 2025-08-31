# Label Station (Flask + ZPL)

A small touchscreen-friendly web app to create and print labels to an AirTrack/Zebra-compatible printer over TCP (port 9100, ZPL).

## Quick start

1. Create a virtualenv and install deps:

```bash
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
```

2. Copy `.env.example` to `.env` and set your printer IP/port.

3. Run the server:

```bash
python -m app.app
```

Open `http://localhost:5000`.

## Notes

- Printing uses raw ZPL over TCP; ensure your AirTrack is in ZPL/Line Print mode and reachable.
- Tweak coordinates in `app/zpl.py` to fit your label stock and printer DPI.
- History is stored as JSONL at `HISTORY_PATH` and is used for simple reprints.