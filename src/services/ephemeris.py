import math

from skyfield.api import load

ts = load.timescale()
eph = load("de421.bsp")
earth = eph["earth"]
OBLIQUITY = math.radians(23.4392911)
