import math
from pathlib import Path

from skyfield.api import load

# Anchor to the repo root regardless of the process's cwd (uvicorn/pytest may
# be launched from anywhere), rather than relying on a relative "de421.bsp".
_BSP_PATH = Path(__file__).resolve().parents[2] / "de421.bsp"

ts = load.timescale()
eph = load(str(_BSP_PATH))
earth = eph["earth"]
OBLIQUITY = math.radians(23.4392911)
