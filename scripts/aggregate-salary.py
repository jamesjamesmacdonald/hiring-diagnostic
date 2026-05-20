# Aggregates 6 Australian tech salary guides into canonical national bands.
# Per-guide figures below were derived from each guide's extracted tables:
#  - per-city guides (Emanate) averaged across cities
#  - per-region guides (Talenza NSW&VIC/QLD, NTP Newcastle/Sydney) averaged
#  - per-seniority guides banded: low = junior low, high = senior high
# Each tuple is (low, median, high) in AUD; None where the guide lacks that column.
# Guides: TG=Think&Grow, MM=Morgan McKinley, EM=Emanate, TZ=Talenza, NTP=NTP, ON=Onset

import json

ROLES = {
    "Software Engineer": [
        (70000, 125000, 200000), (93000, 140000, 198000),
        (109000, 151000, 185000), (88000, None, 173000),
        (68000, None, 170000), (None, 120000, 195000),
    ],
    "Frontend Engineer": [
        (90000, 140000, 190000), (93000, 140000, 198000),
        (97000, 143000, 175000), (88000, None, 178000),
        (63000, None, 170000), (None, 130000, 198000),
    ],
    "Backend Engineer": [
        (110000, 150000, 200000), (93000, 140000, 198000),
        (104000, 149000, 184000), (88000, None, 178000),
        (68000, None, 165000), (None, 130000, 193000),
    ],
    "Full Stack Engineer": [
        (75000, 120000, 170000), (93000, 140000, 198000),
        (109000, 151000, 185000), (88000, None, 173000),
        (68000, None, 170000), (None, 120000, 195000),
    ],
    "Mobile Engineer": [
        (None, None, None), (93000, 140000, 198000),
        (116000, 145000, 178000), (90000, None, 180000),
        (95000, None, 170000), (None, 120000, 177000),
    ],
    "DevOps / SRE Engineer": [
        (110000, 155000, 190000), (130000, 160000, 210000),
        (143000, 162000, 179000), (130000, None, 200000),
        (70000, None, 175000), (None, 140000, 193000),
    ],
    "Data Engineer": [
        (90000, 150000, 185000), (110000, 150000, 190000),
        (129000, 149000, 169000), (138000, None, 205000),
        (105000, None, 165000), (None, 145000, 200000),
    ],
    "Data Scientist": [
        (110000, 150000, 200000), (110000, 150000, 190000),
        (141000, 168000, 187000), (130000, None, 190000),
        (130000, None, 180000), (None, 140000, 190000),
    ],
    "Machine Learning / AI Engineer": [
        (110000, 150000, 210000), (None, None, None),
        (None, None, None), (None, None, None),
        (130000, None, 210000), (None, 145000, 200000),
    ],
    "QA / Test Engineer": [
        (85000, 125000, 178000), (93000, 140000, 198000),
        (97000, 137000, 171000), (85000, None, 140000),
        (90000, None, 160000), (None, 110000, 155000),
    ],
    "Security Engineer": [
        (130000, 175000, 210000), (130000, 170000, 220000),
        (100000, 120000, 140000), (100000, None, 190000),
        (120000, None, 180000), (None, 155000, 213000),
    ],
    "Cloud Engineer": [
        (100000, 172000, 180000), (140000, 170000, 220000),
        (134000, 152000, 165000), (99000, None, 153000),
        (None, None, None), (None, None, None),
    ],
    "Solutions Architect": [
        (170000, 200000, 210000), (165000, 190000, 220000),
        (174000, 200000, 234000), (183000, None, 245000),
        (150000, None, 190000), (None, 205000, 255000),
    ],
    "Engineering Manager": [
        (135000, 186000, 260000), (156000, 187000, 229000),
        (186000, 212000, 249000), (130000, None, 225000),
        (165000, None, 225000), (None, None, None),
    ],
    "Tech Lead / Principal Engineer": [
        (155000, 187000, 220000), (135000, 171000, 203000),
        (168000, 189000, 222000), (169000, None, 200000),
        (155000, None, 190000), (None, 183000, 248000),
    ],
    "Product Manager": [
        (90000, 160000, 210000), (None, None, None),
        (138000, 152000, 168000), (110000, None, 200000),
        (130000, None, 170000), (None, 155000, 215000),
    ],
    "Product Designer / UX Designer": [
        (90000, 140000, 195000), (93000, 140000, 198000),
        (125000, 136000, 152000), (110000, None, 190000),
        (90000, None, 180000), (None, 120000, 170000),
    ],
    "Data Analyst": [
        (80000, 125000, 170000), (100000, 122000, 140000),
        (110000, 133000, 156000), (130000, None, 143000),
        (95000, None, 145000), (None, 120000, 150000),
    ],
    "Business Analyst": [
        (95000, 135000, 185000), (None, None, None),
        (120000, 137000, 159000), (113000, None, 138000),
        (100000, None, 153000), (None, 140000, 195000),
    ],
    "Engineering Director / VP": [
        (160000, 235000, 340000), (170000, 210000, 260000),
        (223000, 245000, 280000), (None, None, None),
        (200000, None, 275000), (None, 227000, 325000),
    ],
    "CTO": [
        (109000, 250000, 350000), (210000, 250000, 400000),
        (None, None, None), (200000, None, 450000),
        (225000, None, 300000), (None, 230000, 325000),
    ],
}


def avg(values):
    vals = [v for v in values if v is not None]
    return round(sum(vals) / len(vals) / 1000) * 1000 if vals else None


out = {}
for role, rows in ROLES.items():
    lows = [r[0] for r in rows]
    meds = [r[1] for r in rows]
    highs = [r[2] for r in rows]
    sources = sum(1 for r in rows if any(x is not None for x in r))
    out[role] = {
        "low": avg(lows),
        "median": avg(meds),
        "high": avg(highs),
        "guides": sources,
    }

print(json.dumps(out, indent=2))
