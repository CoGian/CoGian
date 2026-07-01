#!/usr/bin/env python3
"""Build script for Mininio Carb Tracker GitHub Pages site.

Reads version + changelog from a private repo checkout and generates
the static site for deployment.
"""

import argparse
import os
import re
import shutil
import sys
from pathlib import Path

PAGES_DIR = Path(__file__).resolve().parent.parent / "src" / "mininio"


def extract_version(repo_path):
    """Extract versionName from app/build.gradle.kts."""
    gradle_path = Path(repo_path) / "app" / "build.gradle.kts"
    content = gradle_path.read_text(encoding="utf-8")
    match = re.search(r'versionName\s*=\s*"(\d+\.\d+\.\d+)"', content)
    if not match:
        print("ERROR: Could not find versionName in build.gradle.kts", file=sys.stderr)
        sys.exit(1)
    return match.group(1)


def extract_version_date(repo_path):
    """Extract the date of the latest release from CHANGELOG."""
    changelog_path = Path(repo_path) / "CHANGELOG"
    content = changelog_path.read_text(encoding="utf-8")
    match = re.search(r"## \d+\.\d+\.\d+ \(([^)]+)\)", content)
    if match:
        return match.group(1)
    return "2025"


def build_changelog_html(repo_path):
    """Parse CHANGELOG and convert to HTML."""
    changelog_path = Path(repo_path) / "CHANGELOG"
    content = changelog_path.read_text(encoding="utf-8")

    lines = content.split("\n")
    html_parts = []

    for line in lines:
        m = re.match(r"^## (\d+\.\d+\.\d+) \(([^)]+)\)", line)
        if m:
            version, date = m.group(1), m.group(2)
            if html_parts and "</ul>" not in html_parts[-1]:
                html_parts.append("</ul>")
            html_parts.append('<div class="changelog-entry">')
            html_parts.append(
                f'<div class="changelog-version"><h3>v{version}</h3>'
                f'<span class="changelog-date">{date}</span></div>'
            )
            html_parts.append('<ul class="changelog-changes">')
            continue

        stripped = line.strip()
        if stripped.startswith("- "):
            text = escape_html(stripped[2:])
            html_parts.append(f"<li>{text}</li>")
            continue

        if stripped.startswith("* "):
            text = escape_html(stripped[2:])
            html_parts.append(f"<li style='padding-left:1.25rem;list-style-type:circle;'>{text}</li>")
            continue

    if html_parts and "</ul>" not in html_parts[-1]:
        html_parts.append("</ul>")
        html_parts.append("</div>")

    return "\n".join(html_parts)


def escape_html(text):
    return (
        text.replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace('"', "&quot;")
    )


def build(repo_path, output_dir):
    """Main build function."""
    repo = Path(repo_path)
    if not repo.is_dir():
        print(f"ERROR: repo path not found: {repo}", file=sys.stderr)
        sys.exit(1)

    version = extract_version(repo)
    version_date = extract_version_date(repo)
    changelog_html = build_changelog_html(repo)

    print(f"Version: {version}")
    print(f"Date: {version_date}")
    print(f"Changelog entries: {changelog_html.count('changelog-entry')}")

    # Read template
    template_path = PAGES_DIR / "template.html"
    template = template_path.read_text(encoding="utf-8")

    output = template.replace("{{VERSION}}", version)
    output = output.replace("{{VERSION_DATE}}", version_date)
    output = output.replace("{{CHANGELOG_HTML}}", changelog_html)

    # Prepare output directory
    site_dir = Path(output_dir)
    if site_dir.exists():
        shutil.rmtree(site_dir)
    site_dir.mkdir(parents=True, exist_ok=True)

    images_dest = site_dir / "images"
    images_dest.mkdir(parents=True, exist_ok=True)

    # Write index.html
    index_path = site_dir / "index.html"
    index_path.write_text(output, encoding="utf-8")
    print(f"Written: {index_path} ({len(output)} bytes)")

    # Copy static assets
    for asset in ["styles.css", "script.js"]:
        src = PAGES_DIR / asset
        if src.exists():
            shutil.copy2(src, site_dir / asset)
            print(f"Copied: {asset}")

    # Copy images
    images_src = PAGES_DIR / "images"
    if images_src.exists():
        for img in images_src.iterdir():
            if img.is_file():
                shutil.copy2(img, images_dest / img.name)
                print(f"Copied: images/{img.name}")

    print(f"\nBuild complete! Site ready in {site_dir}/")
    return 0


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Build Mininio Carb Tracker pages site")
    parser.add_argument(
        "--repo-path",
        required=True,
        help="Path to cloned mininio_carb_tracker repo (for version + changelog)",
    )
    parser.add_argument(
        "--output-dir",
        default="_site/mininio",
        help="Output directory for the generated site (default: _site/mininio)",
    )
    args = parser.parse_args()
    sys.exit(build(args.repo_path, args.output_dir))
