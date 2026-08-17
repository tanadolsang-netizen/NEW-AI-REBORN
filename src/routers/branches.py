from pathlib import Path
from fastapi import APIRouter
import os

router = APIRouter()

_DEFAULT_BASE = Path(__file__).resolve().parents[2] / 'raw' / 'astrology'
_FALLBACK_BASE = Path(__file__).resolve().parents[3] / 'AI REBORN' / 'raw' / 'astrology'
BASE = Path(os.getenv('ASTRO_RAW_DIR', _DEFAULT_BASE if _DEFAULT_BASE.exists() else _FALLBACK_BASE))


@router.get("/list")
async def list_branches():
    branches = []
    for p in sorted(BASE.glob("*.md")):
        branches.append({"slug": p.stem, "path": str(p.relative_to(BASE.parent.parent))})
    return {"branches": branches}


@router.get("/{slug}")
async def get_branch(slug: str):
    path = BASE / f"{slug}.md"
    if not path.exists():
        return {"detail": "not found"}
    return {"slug": slug, "content": path.read_text(encoding="utf-8")}
