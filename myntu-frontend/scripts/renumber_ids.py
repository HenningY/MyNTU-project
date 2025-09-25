#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Renumber ServiceItem ids in src/data/services.ts sequentially (1..n) based on
their current order in the exported services array, without reordering items.

Usage:
  python3 scripts/renumber_ids.py               # default target
  python3 scripts/renumber_ids.py /abs/path/to/services.ts
  python3 scripts/renumber_ids.py --dry-run     # show changes only

Notes:
  - Only the id values are rewritten.
  - Matching is limited to the services array block to avoid accidental edits.
"""

from __future__ import annotations

import os
import re
import sys
from typing import Tuple


def read_text(path: str) -> str:
  with open(path, 'r', encoding='utf-8') as f:
    return f.read()


def write_text(path: str, content: str) -> None:
  with open(path, 'w', encoding='utf-8') as f:
    f.write(content)


def find_services_array_span(src: str) -> Tuple[int, int]:
  # Locate the start of the services array: export const services: ServiceItem[] = [
  m = re.search(r"export\s+const\s+services\s*:\s*ServiceItem\[\]\s*=\s*\[", src)
  if not m:
    raise RuntimeError('Could not locate services array declaration')
  start_bracket = m.end() - 1  # position of '['

  # Find the matching closing ']' while handling strings
  i = start_bracket
  depth = 0
  in_str = False
  str_delim = ''
  escaped = False
  while i < len(src):
    ch = src[i]
    if in_str:
      if escaped:
        escaped = False
      elif ch == '\\':
        escaped = True
      elif ch == str_delim:
        in_str = False
    else:
      if ch in ('"', "'", '`'):
        in_str = True
        str_delim = ch
      elif ch == '[':
        depth += 1
      elif ch == ']':
        depth -= 1
        if depth == 0:
          # Include the closing bracket in span
          return (start_bracket, i)
    i += 1
  raise RuntimeError('Unbalanced brackets when scanning services array')


def renumber_ids_in_array_block(block: str) -> Tuple[str, int]:
  # Iterate top-level objects inside the array and replace first id: '...'
  out_parts = []
  i = 0
  count = 0
  while i < len(block):
    ch = block[i]
    if ch == '{':
      # capture object with brace depth, respecting strings
      start = i
      depth = 1
      i += 1
      in_str = False
      str_delim = ''
      escaped = False
      while i < len(block) and depth > 0:
        c = block[i]
        if in_str:
          if escaped:
            escaped = False
          elif c == '\\':
            escaped = True
          elif c == str_delim:
            in_str = False
        else:
          if c in ('"', "'", '`'):
            in_str = True
            str_delim = c
          elif c == '{':
            depth += 1
          elif c == '}':
            depth -= 1
        i += 1
      end = i  # position after closing '}'
      obj = block[start:end]

      # Replace the first id field's value only
      def _sub_id(m: re.Match) -> str:
        nonlocal count
        count += 1
        prefix = m.group(1)  # 'id' + spaces + ':' + spaces
        quote = m.group(2)
        return f"{prefix}{quote}{count}{quote}"

      obj_new = re.sub(r"(id\s*:\s*)(['\"])\s*.*?\s*\2", _sub_id, obj, count=1)
      out_parts.append(obj_new)
    else:
      # Copy non-object content (commas, whitespace, comments, etc.)
      out_parts.append(ch)
      i += 1
  return (''.join(out_parts), count)


def main() -> None:
  # Resolve target path
  dry_run = False
  args = [a for a in sys.argv[1:] if a != '--dry-run']
  dry_run = ('--dry-run' in sys.argv[1:])

  if len(args) >= 1 and args[0] and not args[0].startswith('--'):
    target = args[0]
  else:
    # default: relative to project root (this script is under myntu-frontend/scripts)
    script_dir = os.path.dirname(os.path.abspath(__file__))
    target = os.path.abspath(os.path.join(script_dir, '..', 'src', 'data', 'services.ts'))

  src = read_text(target)
  lb, rb = find_services_array_span(src)
  array_block = src[lb:rb+1]

  new_block, n = renumber_ids_in_array_block(array_block)
  if n == 0:
    print('No ServiceItem objects found; nothing changed.')
    return

  new_src = src[:lb] + new_block + src[rb+1:]
  if dry_run:
    print(f'[dry-run] Would renumber {n} ids in: {target}')
    return

  write_text(target, new_src)
  print(f'Renumbered {n} ids in: {target}')


if __name__ == '__main__':
  main()


