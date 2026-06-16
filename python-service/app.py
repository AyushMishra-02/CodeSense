from flask import Flask, request, jsonify
from flask_cors import CORS
from analyzer import analyze_code
from linter import lint_code

app = Flask(__name__)
CORS(app)


@app.route("/preprocess", methods=["POST"])
def preprocess():
    """Preprocess code: analyze structure and run linting."""
    data = request.get_json()

    if not data or "code" not in data:
        return jsonify({"error": "Code is required"}), 400

    code = data["code"]
    language = data.get("language", "python")

    # Run analysis
    stats, ast_valid, parse_errors = analyze_code(code, language)

    # Run linting
    lint_issues = lint_code(code, language)

    # Combine parse errors with lint issues
    all_issues = parse_errors + lint_issues

    result = {
        "stats": stats,
        "lint_issues": all_issues[:20],  # Cap at 20 issues
        "ast_valid": ast_valid,
    }

    return jsonify(result)


@app.route("/health", methods=["GET"])
def health():
    """Health check endpoint."""
    return jsonify({"status": "ok", "service": "CodeSense Preprocessor"})


if __name__ == "__main__":
    print("\n🐍 CodeSense Python Preprocessor running on port 5050\n")
    app.run(host="0.0.0.0", port=5050, debug=True)
