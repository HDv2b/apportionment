[Home](README.md) | [Change Log](CHANGELOG.md) | [Contribution Guide](CONTRIBUTING.md) | [License (MIT)](LICENSE.md)

# Changelog

## 3.0.0 - 2026-02-03

* Modernized toolchain with Biome and Vitest. 
* Tree-shakeable library.

### Breaking changes

Reverted to the simplicity of v1 while keeping the verbosity of v2 with extra control.

* All methods now output the same format to allow easier switching by the user. This format is minimal for simplicity and performance.
* An optional callback function can be used to log each step of the calculation, for debugging or educational purposes.

```ts
function myLogger(calculationStep, data) {
  console.log(calculationStep, data)
}

const result1 = adams([21878, 9713, 4167, 3252, 1065], 43, myLogger);
const result2 = adams([9, 5, 9, 1, 3, 5, 8], 20);

// result1 = { exact: [22, 10, 5, 4, 2] }
// result2 =
// {
//   low: [4, 2, 4, 1, 2, 2, 4],
//   high: [4, 3, 4, 1, 2, 3, 4],
// }

// console output:
/*
> "SUM_POP", 40075
> "INIT_DIVISOR", 931.9767441860465
> "INIT_QUOTIENTS"}, [23.47483468496569, 10.421933873986276, 4.4711416094822205,3.489357454772302, 1.14273237679351 
> "INIT_ALLOCATION", [24, 11, 5, 4, 2]
> "INIT_SEATS", 46
> ... etc
 */

```

## 2.0.0 - 2022-04-25

### Breaking changes 

The output of each function has been changed to show the calculation steps for debugging 
or educational purposes, eg:

```ts
import {hamilton} from "apportionment"

const numSeats = 20;                             // 20 seats to apportion
const populations = [2560, 3315, 995, 5012];     // populations of 4 states
const result = hamilton(populations, numSeats);
console.log(result.apportionment);               // => [4, 6, 2, 8]
                                                 // how to distribute the 20 seats according to the Hamilton Method

// If you want to see the working out (for debugging or academic purposes), you have the rest of the object available:
console.log(result);
/*
=> {
    divisor: 594.1,
    quotients: [4.30903888234304, 5.579868708971554, 1.6748022218481737, 8.436290186837233],
    preallocation: [4, 5, 1, 8],
    remainders: [0.30903888234303967, 0.5798687089715537, 0.6748022218481737, 0.4362901868372333],
    preallocationSum: 18,
    preallocationLeftOver: 2,
    leftOverAllocation: [0, 1, 1, 0],
    // v1 would just return this following line:
    apportionment: [4, 6, 2, 8],
}
*/
```

## 1.0.0 - 2022-04-10

First release with lightweight library of following methods:

* hamilton
* jefferson
* adams
* webster
* huntingtonHill

Output is a single array of values where possible, or else an object containing the 
upper and lower bounds.

