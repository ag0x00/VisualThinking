#!/bin/bash
# Build the ink-in-water spike. Single Swift file; Metal shaders compile at runtime.
set -e
cd "$(dirname "$0")"
swiftc -O main.swift -o inkspike \
  -framework Cocoa -framework Metal -framework MetalKit
echo "built ./inkspike  —  run it, Esc or q to quit"
