# Apportionment Methods

This document describes the apportionment methods implemented in this repository and summarizes their pros, cons, and typical tendencies.

## Jefferson

Method:
1. Compute the standard divisor = total population / total seats.
2. Divide each state's population by the standard divisor to get quotients.
3. Round quotients down (floor).
4. If total allocated seats is less than available seats, decrease divisor and repeat; if more, increase divisor and repeat.

Favours: larger states.

Pros:
- Stable with respect to the Alabama Paradox (monotonic changes behave consistently).

Cons:
- Can violate Quota rules: allocations may differ from exact quota by more than 1.

## Adams

Method:
1. Compute the standard divisor.
2. Divide each state's population by the standard divisor to get quotients.
3. Round quotients up (ceil).
4. Adjust divisor and repeat until allocations sum to the required seats.

Favours: smaller states.

Pros:
- Provides a consistent rounding rule when preferring smaller constituencies.

Cons:
- Can violate Quota rules; may produce counter-intuitive allocations for some inputs.

## Webster

Method:
1. Compute standard divisor.
2. Divide populations by divisor to get quotients.
3. Round quotients to the nearest integer (round).
4. Adjust divisor and repeat until totals match.

Favours: fewer large-state bias than Jefferson.

Pros:
- Generally fairer near-proportional results compared to Jefferson.

Cons:
- Can occasionally violate Quota rules.

## Huntington–Hill

Method:
1. Compute standard divisor.
2. Divide populations by divisor to get quotients.
3. Compare quotient to geometric mean between floor and ceil: if quotient is above geometric mean, round up; otherwise round down.
4. Adjust divisor and repeat.

The geometric mean between integers n and n+1 is sqrt(n*(n+1)); this provides the rounding threshold.

Favours: reduced bias.

Pros:
- Reduces bias compared to Jefferson and Adams.

Cons:
- Can still violate Quota rules in some cases.

## Hamilton (Largest Remainders)

Method:
1. Compute standard divisor.
2. Assign floor(quotient) to each state.
3. Distribute any remaining seats to states with largest fractional remainders.

Favours: preserves quota (no systematic size bias).

Pros:
- Easy to understand and implement.
- Preserves quota exactly; never gives allocations more than 1 away from the quota.

Cons:
- Can suffer from paradoxes (e.g., Alabama Paradox) where increasing the total number of seats can reduce a state's allocation.

---

If you want this content split into per-method markdown files or exported to the README, I can do that next.
