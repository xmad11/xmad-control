#!/usr/bin/env python3

import json
import sys

NODE_FIELD_COUNT = 6
NODE_TYPES = [
    'hidden', 'array', 'string', 'object', 'code', 'closure',
    'regexp', 'number', 'native', 'synthetic', 'concatenated string',
    'sliced string', 'symbol', 'bigint', 'object shape'
]

def load_snapshot(path):
    print(f"Loading {path.split('/')[-1]}...")
    with open(path) as f:
        data = json.load(f)
    return data

def analyze_snapshot(data):
    snapshot = data['snapshot']
    nodes = data['nodes']
    strings = data['strings']
    node_count = snapshot['node_count']

    type_stats = {}
    constructor_stats = {}
    total_self_size = 0

    for i in range(node_count):
        offset = i * NODE_FIELD_COUNT
        node_type = nodes[offset + 0]
        name_idx = nodes[offset + 1]
        self_size = nodes[offset + 3]

        type_name = NODE_TYPES[node_type] if node_type < len(NODE_TYPES) else f'type_{node_type}'
        name = strings[name_idx] if name_idx < len(strings) else ''

        total_self_size += self_size

        # Track by type
        if type_name not in type_stats:
            type_stats[type_name] = {'count': 0, 'self_size': 0}
        type_stats[type_name]['count'] += 1
        type_stats[type_name]['self_size'] += self_size

        # Track by constructor name
        if name and not name.startswith('(') and not name.startswith('<') and len(name) > 0:
            if name not in constructor_stats:
                constructor_stats[name] = {'count': 0, 'self_size': 0}
            constructor_stats[name]['count'] += 1
            constructor_stats[name]['self_size'] += self_size

    return {
        'total_nodes': node_count,
        'total_self_size_mb': total_self_size / 1024 / 1024,
        'type_stats': type_stats,
        'constructor_stats': constructor_stats,
    }

def main():
    before_file = '/Users/ahmadabdullah/Desktop/Heap-20260103T162216.heapsnapshot'
    after_file = '/Users/ahmadabdullah/Desktop/Heap-20260103T162240.heapsnapshot'

    print('🔬 HEAP SNAPSHOT COMPARISON')
    print('=' * 100)
    print(f"\n📁 BEFORE: {before_file.split('/')[-1]}")
    print(f"📁 AFTER:  {after_file.split('/')[-1]}\n")

    before_data = load_snapshot(before_file)
    after_data = load_snapshot(after_file)

    before_stats = analyze_snapshot(before_data)
    after_stats = analyze_snapshot(after_data)

    # Overall metrics
    print('\n📊 OVERALL METRICS')
    print('─' * 100)
    print(f"{'Metric':<25} {'Before':>20} {'After':>20} {'Delta':>20}")
    print('─' * 100)

    size_delta = after_stats['total_self_size_mb'] - before_stats['total_self_size_mb']
    count_delta = after_stats['total_nodes'] - before_stats['total_nodes']

    print(f"{'Total Heap Size':<25} {before_stats['total_self_size_mb']:>20.2f} MB {after_stats['total_self_size_mb']:>20.2f} MB {size_delta:>+20.2f} MB")
    print(f"{'Total Node Count':<25} {before_stats['total_nodes']:>20,} {after_stats['total_nodes']:>20,} {count_delta:>+20,}")

    # Compare by type
    print('\n\n🏷️  MEMORY BY OBJECT TYPE (Top 20 by Delta)')
    print('─' * 100)

    all_types = set(before_stats['type_stats'].keys()) | set(after_stats['type_stats'].keys())

    type_deltas = []
    for t in all_types:
        before = before_stats['type_stats'].get(t, {'count': 0, 'self_size': 0})
        after = after_stats['type_stats'].get(t, {'count': 0, 'self_size': 0})
        delta = (after['self_size'] - before['self_size']) / 1024 / 1024
        type_deltas.append({
            'type': t,
            'before_size': before['self_size'] / 1024 / 1024,
            'after_size': after['self_size'] / 1024 / 1024,
            'delta_size': delta,
            'before_count': before['count'],
            'after_count': after['count'],
            'delta_count': after['count'] - before['count'],
        })

    type_deltas.sort(key=lambda x: abs(x['delta_size']), reverse=True)

    print(f"{'Type':<30} {'Before':>12} {'After':>12} {'Delta MB':>12} {'Delta Count':>12}")
    print('─' * 100)

    for stat in type_deltas[:20]:
        if abs(stat['delta_size']) < 0.01:
            continue
        delta_str = f"+{stat['delta_size']:.2f}" if stat['delta_size'] >= 0 else f"{stat['delta_size']:.2f}"
        count_str = f"+{stat['delta_count']:,}" if stat['delta_count'] >= 0 else f"{stat['delta_count']:,}"
        print(f"{stat['type'][:30]:<30} {stat['before_size']:>12.2f} MB {stat['after_size']:>12.2f} MB {delta_str:>12} MB {count_str:>12}")

    # Compare by constructor
    print('\n\n🏗️  TOP CONSTRUCTORS BY MEMORY GROWTH')
    print('─' * 100)

    all_constructors = set(before_stats['constructor_stats'].keys()) | set(after_stats['constructor_stats'].keys())

    constructor_deltas = []
    for name in all_constructors:
        before = before_stats['constructor_stats'].get(name, {'count': 0, 'self_size': 0})
        after = after_stats['constructor_stats'].get(name, {'count': 0, 'self_size': 0})
        delta = (after['self_size'] - before['self_size']) / 1024 / 1024
        constructor_deltas.append({
            'name': name,
            'before_size': before['self_size'] / 1024 / 1024,
            'after_size': after['self_size'] / 1024 / 1024,
            'delta_size': delta,
            'before_count': before['count'],
            'after_count': after['count'],
            'delta_count': after['count'] - before['count'],
        })

    constructor_deltas = [d for d in constructor_deltas if d['after_count'] > 0 and abs(d['delta_size']) > 0.01]
    constructor_deltas.sort(key=lambda x: x['delta_size'], reverse=True)

    print(f"{'Constructor':<55} {'Before':>10} {'After':>10} {'Delta':>10} {'Total':>8}")
    print('─' * 100)

    for stat in constructor_deltas[:30]:
        delta_str = f"+{stat['delta_size']:.2f}" if stat['delta_size'] >= 0 else f"{stat['delta_size']:.2f}"
        print(f"{stat['name'][:55]:<55} {stat['before_size']:>10.2f} MB {stat['after_size']:>10.2f} MB {delta_str:>10} MB {stat['after_count']:>8,}")

    # By instance count growth
    print('\n\n📊 TOP CONSTRUCTORS BY INSTANCE GROWTH')
    print('─' * 100)

    by_instance = sorted(constructor_deltas, key=lambda x: x['delta_count'], reverse=True)
    by_instance = [d for d in by_instance if d['delta_count'] > 0]

    print(f"{'Constructor':<55} {'Before':>10} {'After':>10} {'Delta':>10}")
    print('─' * 100)

    for stat in by_instance[:25]:
        count_str = f"+{stat['delta_count']:,}"
        print(f"{stat['name'][:55]:<55} {stat['before_count']:>10,} {stat['after_count']:>10,} {count_str:>10}")

    # Framework-specific
    print('\n\n🔧 NEXT.JS / REACT / TURBOPACK OBJECTS')
    print('─' * 100)

    patterns = ['turbopack', 'react', 'next', 'router', 'module', 'closure', 'fiber', 'component', 'hmr']
    framework_objs = [d for d in constructor_deltas if any(p in d['name'].lower() for p in patterns)]

    if framework_objs:
        print(f"{'Constructor':<55} {'Delta MB':>12} {'Delta Count':>12}")
        print('─' * 100)
        for stat in framework_objs[:20]:
            delta_str = f"+{stat['delta_size']:.2f}" if stat['delta_size'] >= 0 else f"{stat['delta_size']:.2f}"
            count_str = f"+{stat['delta_count']:,}" if stat['delta_count'] >= 0 else f"{stat['delta_count']:,}"
            print(f"{stat['name'][:55]:<55} {delta_str:>12} MB {count_str:>12}")
    else:
        print('  (No significant framework object growth detected)')

    # Key findings
    print('\n\n🎯 KEY FINDINGS')
    print('=' * 100)

    big_growth = [d for d in constructor_deltas if d['delta_size'] > 0.1]
    if big_growth:
        print('\n⚠️  Significant memory growth (>0.1 MB):')
        for stat in big_growth[:10]:
            print(f"  • {stat['name']}: +{stat['delta_size']:.2f} MB ({stat['after_count']:,} instances)")
    else:
        print('\n✅ No significant memory growth detected!')

    print('\n' + '=' * 100)

if __name__ == '__main__':
    main()
