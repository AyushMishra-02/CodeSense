import ast
import re


def analyze_python(code):
    """Analyze Python code using AST parsing."""
    stats = {
        "lines": len(code.strip().split("\n")),
        "functions": 0,
        "classes": 0,
        "imports": 0,
        "complexity_score": "low",
    }

    try:
        tree = ast.parse(code)
        ast_valid = True

        for node in ast.walk(tree):
            if isinstance(node, ast.FunctionDef) or isinstance(
                node, ast.AsyncFunctionDef
            ):
                stats["functions"] += 1
            elif isinstance(node, ast.ClassDef):
                stats["classes"] += 1
            elif isinstance(node, (ast.Import, ast.ImportFrom)):
                stats["imports"] += 1

        # Simple complexity heuristic
        total_structures = stats["functions"] + stats["classes"]
        if total_structures > 10 or stats["lines"] > 200:
            stats["complexity_score"] = "high"
        elif total_structures > 5 or stats["lines"] > 100:
            stats["complexity_score"] = "medium"

    except SyntaxError as e:
        ast_valid = False
        return stats, ast_valid, [
            {
                "line": e.lineno or 0,
                "message": f"Syntax Error: {e.msg}",
                "severity": "critical",
            }
        ]

    return stats, ast_valid, []


def analyze_javascript(code):
    """Analyze JavaScript/TypeScript code using regex-based heuristics."""
    lines = code.strip().split("\n")
    stats = {
        "lines": len(lines),
        "functions": 0,
        "classes": 0,
        "imports": 0,
        "complexity_score": "low",
    }

    function_patterns = [
        r"\bfunction\s+\w+",
        r"\bconst\s+\w+\s*=\s*(?:async\s+)?\(",
        r"\b(?:async\s+)?(?:\w+)\s*\([^)]*\)\s*\{",
        r"=>\s*\{",
    ]

    for line in lines:
        for pattern in function_patterns:
            if re.search(pattern, line):
                stats["functions"] += 1
                break
        if re.search(r"\bclass\s+\w+", line):
            stats["classes"] += 1
        if re.search(r"\b(?:import|require)\b", line):
            stats["imports"] += 1

    total = stats["functions"] + stats["classes"]
    if total > 10 or stats["lines"] > 200:
        stats["complexity_score"] = "high"
    elif total > 5 or stats["lines"] > 100:
        stats["complexity_score"] = "medium"

    return stats, True, []


def analyze_java(code):
    """Analyze Java code using regex-based heuristics."""
    lines = code.strip().split("\n")
    stats = {
        "lines": len(lines),
        "functions": 0,
        "classes": 0,
        "imports": 0,
        "complexity_score": "low",
    }

    for line in lines:
        if re.search(
            r"\b(?:public|private|protected|static)?\s*(?:void|int|String|boolean|double|float|long|char|Object|\w+)\s+\w+\s*\(",
            line,
        ):
            stats["functions"] += 1
        if re.search(r"\bclass\s+\w+", line):
            stats["classes"] += 1
        if re.search(r"\bimport\s+", line):
            stats["imports"] += 1

    total = stats["functions"] + stats["classes"]
    if total > 10 or stats["lines"] > 200:
        stats["complexity_score"] = "high"
    elif total > 5 or stats["lines"] > 100:
        stats["complexity_score"] = "medium"

    return stats, True, []


def analyze_code(code, language):
    """Route analysis to the appropriate language analyzer."""
    analyzers = {
        "python": analyze_python,
        "javascript": analyze_javascript,
        "typescript": analyze_javascript,
        "java": analyze_java,
        "cpp": analyze_javascript,  # Basic heuristic fallback
        "go": analyze_javascript,
    }

    analyzer = analyzers.get(language, analyze_javascript)
    return analyzer(code)
