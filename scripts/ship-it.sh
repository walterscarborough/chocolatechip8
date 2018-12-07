#!/usr/bin/env bash

function set_bash_error_handling() {
    set -euo pipefail
}

function go_to_project_root_directory() {
    local -r script_dir=$( dirname "${BASH_SOURCE[0]}")

    cd "$script_dir/.."
}

function run_linters() {
    ./scripts/lint.sh
}

function run_tests() {
    ./scripts/test.sh
}

function push_code() {
    git push
}

function display_ascii_success_message() {
    local -r GREEN_COLOR_CODE='\033[1;32m'
    echo -e "${GREEN_COLOR_CODE}\\n$(cat scripts/success-ascii-art.txt)"
}

function main() {
    set_bash_error_handling
    go_to_project_root_directory

    run_linters
    run_tests

    push_code
    display_ascii_success_message
}

main "$@"
