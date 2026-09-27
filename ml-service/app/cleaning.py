import re


def clean_text(value: str) -> str:
    """Normalize whitespace without changing the words used for matching."""
    return re.sub(r"\s+", " ", value).strip()


def split_paragraphs(value: str, minimum_length: int = 40) -> list[str]:
    """Return meaningful paragraphs, keeping the original paragraph boundaries."""
    raw_paragraphs = re.split(r"\r?\n\s*\r?\n", value.strip())
    paragraphs = [clean_text(paragraph) for paragraph in raw_paragraphs]
    return [paragraph for paragraph in paragraphs if len(paragraph) >= minimum_length]


def remove_reference_section(value: str) -> str:
    """Remove a conventional References/Bibliography section before matching."""
    match = re.search(r"(?:^|\n)\s*(references|bibliography|works cited)\s*(?:\n|$)", value, flags=re.IGNORECASE)
    return value[:match.start()].strip() if match else value
