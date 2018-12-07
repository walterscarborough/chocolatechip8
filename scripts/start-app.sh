#!/usr/bin/env bash

function set_bash_error_handling() {
    set -euo pipefail
}

function go_to_project_root_directory() {
    local -r script_dir=$( dirname "${BASH_SOURCE[0]}")

    cd "$script_dir/.."
}

function build_jar() {
    ./gradlew clean build jar
}

function start_app() {
    java -jar application/build/libs/application.jar
}

function main() {
    set_bash_error_handling
    go_to_project_root_directory

    build_jar
    start_app
}

main "$@"
