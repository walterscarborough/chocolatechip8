#!/usr/bin/env bash

function set_bash_error_handling() {
    set -euo pipefail
}

function go_to_project_root_directory() {
    local -r script_dir=$( dirname "${BASH_SOURCE[0]}")

    cd "$script_dir/.."
}

function run_tests() {
    ./gradlew test
}

function main() {
    set_bash_error_handling
    go_to_project_root_directory

    run_tests
}

main "$@"
