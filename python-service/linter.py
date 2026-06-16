import re


def lint_python(code):
    """Basic Python linting using regex patterns."""
    issues = []
    lines = code.split("\n")

    for i, line in enumerate(lines, 1):
        # Check for bare except
        if re.search(r"\bexcept\s*:", line):
            issues.append(
                {
                    "line": i,
                    "message": "Bare except clause — catch specific exceptions instead",
                    "severity": "warning",
                }
            )

        # Check for wildcard imports
        if re.search(r"from\s+\w+\s+import\s+\*", line):
            issues.append(
                {
                    "line": i,
                    "message": "Wildcard import detected — import specific names",
                    "severity": "warning",
                }
            )

        # Check for print statements (debugging artifacts)
        if re.search(r"\bprint\s*\(", line) and not line.strip().startswith("#"):
            issues.append(
                {
                    "line": i,
                    "message": "Print statement found — consider using logging module",
                    "severity": "info",
                }
            )

        # Line too long
        if len(line) > 120:
            issues.append(
                {
                    "line": i,
                    "message": f"Line too long ({len(line)} > 120 characters)",
                    "severity": "info",
                }
            )

        # TODO comments
        if re.search(r"#\s*TODO", line, re.IGNORECASE):
            issues.append(
                {
                    "line": i,
                    "message": "TODO comment found — consider addressing",
                    "severity": "info",
                }
            )

    return issues


def lint_javascript(code):
    """Basic JavaScript linting using regex patterns."""
    issues = []
    lines = code.split("\n")

    for i, line in enumerate(lines, 1):
        # var usage
        if re.search(r"\bvar\s+", line):
            issues.append(
                {
                    "line": i,
                    "message": "Use 'let' or 'const' instead of 'var'",
                    "severity": "warning",
                }
            )

        # == instead of ===
        if re.search(r"[^=!]==[^=]", line):
            issues.append(
                {
                    "line": i,
                    "message": "Use strict equality (===) instead of loose equality (==)",
                    "severity": "warning",
                }
            )

        # console.log
        if re.search(r"\bconsole\.\w+\s*\(", line) and not line.strip().startswith("//"):
            issues.append(
                {
                    "line": i,
                    "message": "Console statement found — remove before production",
                    "severity": "info",
                }
            )

        # eval usage
        if re.search(r"\beval\s*\(", line):
            issues.append(
                {
                    "line": i,
                    "message": "eval() is dangerous — avoid using it",
                    "severity": "critical",
                }
            )

        # Line too long
        if len(line) > 120:
            issues.append(
                {
                    "line": i,
                    "message": f"Line too long ({len(line)} > 120 characters)",
                    "severity": "info",
                }
            )

    return issues


def lint_code(code, language):
    """Route linting to the appropriate language linter."""
    linters = {
        "python": lint_python,
        "javascript": lint_javascript,
        "typescript": lint_javascript,
        "java": lint_javascript,  # Basic fallback
        "cpp": lint_javascript,
        "go": lint_javascript,
    }

    linter = linters.get(language, lint_javascript)
    return linter(code)
