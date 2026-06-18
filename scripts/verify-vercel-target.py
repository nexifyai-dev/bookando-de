#!/usr/bin/env python3
"""Verify repository-local Vercel target against canonical values."""
from __future__ import annotations

import json
import sys
from pathlib import Path

V = Path(__file__).resolve().parent.parent / "docs" / "infrastructure" / "VERCEL_TARGET.yaml"

SERVICE = "frontend"
EXP_SLUG = "agentur-projekte"
EXP_TEAM = "team_PysE3t7EB7f6F2bA85MBUdOD"
EXP_NAME = "bookando-de"
EXP_PROJ = "prj_zeVjo026RtGWcQy58uTYwrEHJLQE"
EXP_REPO = "nexifyai-dev/bookando-de"
EXP_DOMAIN = "https://bookando-de-one.vercel.app"
errors = []

if not V.exists():
    errors.append(f"MISSING: {V}")
else:
    c = V.read_text()
    checks = {k: v for k, v in [
        ("TEAM_SLUG", EXP_SLUG), ("TEAM_ID", EXP_TEAM),
        ("PROJECT_NAME", EXP_NAME), ("PROJECT_ID", EXP_PROJ),
        ("REPOSITORY", EXP_REPO), ("PRODUCTION_DOMAIN", EXP_DOMAIN),
    ]}
    for label, val in checks.items():
        if val not in c:
            errors.append(f"MISSING {label}={val}")
    # Check operational fields exist
    for field in ["deployment_state", "application_health", "operationally_approved"]:
        if field not in c:
            errors.append(f"MISSING operational field: {field}")

# Check .vercel/project.json
PJ = V.parent.parent / ".vercel" / "project.json"
if PJ.exists():
    d = json.loads(PJ.read_text())
    if d.get("orgId") != EXP_TEAM:
        errors.append(f"VERCEL_ORG_MISMATCH: {d.get('orgId')} != {EXP_TEAM}")
    if d.get("projectId") != EXP_PROJ:
        errors.append(f"VERCEL_PROJECT_MISMATCH: {d.get('projectId')} != {EXP_PROJ}")

# Check no runtime crept in
for bad in ["api/index.py", "api/requirements.txt", ".trigger-deploy"]:
    bp = V.parent.parent / bad
    if bp.exists():
        from git import Repo
        diff = Repo(str(bp.parent)).git.diff("main..HEAD", "--", bad)
        if diff:
            errors.append(f"RUNTIME_LEAKED_INTO_DOCS_PR: {bad}")

print(f"SERVICE = {SERVICE}")
print(f"TEAM_SLUG = {EXP_SLUG}")
print(f"TEAM_ID = {EXP_TEAM}")
print(f"PROJECT_NAME = {EXP_NAME}")
print(f"PROJECT_ID = {EXP_PROJ}")
print(f"REPOSITORY = {EXP_REPO}")
print(f"PRODUCTION_DOMAIN = {EXP_DOMAIN}")
print(f"DEPLOYMENT_STATE = (checked via VERCEL_TARGET.yaml)")
print(f"APPLICATION_HEALTH = (checked via VERCEL_TARGET.yaml)")
print(f"ERRORS = {len(errors)}")
for e in errors:
    print(f"  - {e}")

sys.exit(1 if errors else 0)
