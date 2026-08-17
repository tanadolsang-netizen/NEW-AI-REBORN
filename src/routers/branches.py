from pathlib import Path
from fastapi import APIRouter

router = APIRouter()
BASE = Path(__file__).resolve().parents[2] / "raw" / "astrology"


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
