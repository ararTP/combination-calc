
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Calculator as CalculatorIcon, Hash, Shuffle, ArrowRightLeft, Zap, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

export default function Calculator() {
  const [n, setN] = useState(5);
  const [k, setK] = useState(2);
  const [results, setResults] = useState({});
  const [errors, setErrors] = useState({});

  // Factorial function
  const factorial = (num) => {
    if (num < 0) return null;
    if (num === 0 || num === 1) return 1;
    let result = 1;
    for (let i = 2; i <= num; i++) {
      result *= i;
    }
    return result;
  };

  // Combinations C(n,k) = n! / (k! * (n-k)!)
  const combinations = (n, k) => {
    if (k > n || k < 0 || n < 0) return null;
    const nFact = factorial(n);
    const kFact = factorial(k);
    const nkFact = factorial(n - k);
    if (nFact === null || kFact === null || nkFact === null) return null;
    return nFact / (kFact * nkFact);
  };

  // Combinations with repetition C(n+k-1, k)
  const combinationsWithRepetition = (n, k) => {
    if (k < 0) return null; // k cannot be negative
    if (n < 0) return null; // n cannot be negative

    // Special case: If n is 0 and k is greater than 0, it's impossible to choose anything.
    if (n === 0 && k > 0) return 0;
    // If n is 0 and k is 0, there's one way to choose nothing from nothing.
    if (n === 0 && k === 0) return 1;

    // For other cases, use the standard formula C(n+k-1, k)
    // Rely on combinations' validation for cases like n+k-1 < k
    return combinations(n + k - 1, k);
  };

  // Permutations P(n,k) = n! / (n-k)!
  const permutations = (n, k) => {
    if (k > n || k < 0 || n < 0) return null;
    const nFact = factorial(n);
    const nkFact = factorial(n - k);
    if (nFact === null || nkFact === null) return null;
    return nFact / nkFact;
  };

  // Derangements D(n) - subfactorial
  const derangements = (n) => {
    if (n < 0) return null;
    if (n === 0) return 1;
    if (n === 1) return 0;
    let result = 0;
    for (let i = 0; i <= n; i++) {
      result += Math.pow(-1, i) / factorial(i);
    }
    return Math.round(factorial(n) * result);
  };

  // Functions from set A to set B |B|^|A| = k^n
  const power = (n, k) => {
    if (n < 0 || k < 0) return null;
    return Math.pow(k, n);
  };

  useEffect(() => {
    const newResults = {};
    const newErrors = {};

    // Calculate combinations
    const comb = combinations(n, k);
    if (comb !== null && isFinite(comb)) {
      newResults.combinations = comb;
    } else {
      newErrors.combinations = "Invalid input";
    }

    // Calculate combinations with repetition
    const combRep = combinationsWithRepetition(n, k);
    if (combRep !== null && isFinite(combRep)) {
      newResults.combinationsWithRepetition = combRep;
    } else {
      newErrors.combinationsWithRepetition = "Invalid input";
    }

    // Calculate permutations
    const perm = permutations(n, k);
    if (perm !== null && isFinite(perm)) {
      newResults.permutations = perm;
    } else {
      newErrors.permutations = "Invalid input";
    }

    // Calculate factorial (only depends on n)
    const fact = factorial(n);
    if (fact !== null && isFinite(fact)) {
      newResults.factorial = fact;
    } else {
      newErrors.factorial = "Invalid input";
    }

    // Calculate derangements (only depends on n)
    const derang = derangements(n);
    if (derang !== null && isFinite(derang)) {
      newResults.derangements = derang;
    } else {
      newErrors.derangements = "Invalid input";
    }

    // Calculate power
    const pow = power(n, k);
    if (pow !== null && isFinite(pow)) {
      newResults.power = pow;
    } else {
      newErrors.power = "Invalid input";
    }

    setResults(newResults);
    setErrors(newErrors);
  }, [n, k]);

  const formatNumber = (num) => {
    if (num === null || num === undefined) return "—";
    return num.toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
              <CalculatorIcon className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-light text-slate-800">Combinations Calculator</h1>
          </div>
          <p className="text-slate-600 text-lg font-light">
            Calculate combinations, permutations, derangements, and powers
          </p>
        </motion.div>

        {/* Input Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="mb-8 border-0 shadow-xl bg-white/70 backdrop-blur-sm">
            <CardHeader className="pb-6">
              <CardTitle className="text-xl font-light text-slate-700">Input Values</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <Label htmlFor="n" className="text-slate-600 font-medium">
                    n (total items)
                  </Label>
                  <Input
                    id="n"
                    type="number"
                    value={n}
                    onChange={(e) => setN(parseInt(e.target.value) || 0)}
                    className="text-2xl h-14 border-slate-200 focus:border-blue-400 transition-colors"
                    min="0"
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="k" className="text-slate-600 font-medium">
                    k (items to choose)
                  </Label>
                  <Input
                    id="k"
                    type="number"
                    value={k}
                    onChange={(e) => setK(parseInt(e.target.value) || 0)}
                    className="text-2xl h-14 border-slate-200 focus:border-blue-400 transition-colors"
                    min="0"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Combinations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                    <Hash className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-medium text-slate-700">Combinations</CardTitle>
                    <p className="text-sm text-slate-500">C(n,k) = n! / (k! × (n-k)!)</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-4xl font-light text-slate-800 mb-2">
                    {errors.combinations ? (
                      <span className="text-red-400 text-lg">Invalid</span>
                    ) : (
                      formatNumber(results.combinations)
                    )}
                  </div>
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                    C({n},{k})
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Combinations with Repetition */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center">
                    <RefreshCw className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-medium text-slate-700">With Repetition</CardTitle>
                    <p className="text-sm text-slate-500">C(n+k-1, k)</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-4xl font-light text-slate-800 mb-2">
                    {errors.combinationsWithRepetition ? (
                      <span className="text-red-400 text-lg">Invalid</span>
                    ) : (
                      formatNumber(results.combinationsWithRepetition)
                    )}
                  </div>
                  <Badge variant="outline" className="bg-teal-50 text-teal-700 border-teal-200">
                    C({n + k - 1},{k})
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Permutations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                    <Shuffle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-medium text-slate-700">Permutations</CardTitle>
                    <p className="text-sm text-slate-500">P(n,k) = n! / (n-k)!</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-4xl font-light text-slate-800 mb-2">
                    {errors.permutations ? (
                      <span className="text-red-400 text-lg">Invalid</span>
                    ) : (
                      formatNumber(results.permutations)
                    )}
                  </div>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    P({n},{k})
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Factorial */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                    <Hash className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-medium text-slate-700">Factorial</CardTitle>
                    <p className="text-sm text-slate-500">n! = n × (n-1) × ... × 2 × 1</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-4xl font-light text-slate-800 mb-2">
                    {errors.factorial ? (
                      <span className="text-red-400 text-lg">Invalid</span>
                    ) : (
                      formatNumber(results.factorial)
                    )}
                  </div>
                  <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">
                    {n}!
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Derangements */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-violet-500 rounded-xl flex items-center justify-center">
                    <ArrowRightLeft className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-medium text-slate-700">Derangements</CardTitle>
                    <p className="text-sm text-slate-500">!n (subfactorial of n)</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-4xl font-light text-slate-800 mb-2">
                    {errors.derangements ? (
                      <span className="text-red-400 text-lg">Invalid</span>
                    ) : (
                      formatNumber(results.derangements)
                    )}
                  </div>
                  <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                    !{n}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Functions from A to B */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-medium text-slate-700">Functions (A→B)</CardTitle>
                    <p className="text-sm text-slate-500">k^n (|A|=n, |B|=k)</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-4xl font-light text-slate-800 mb-2">
                    {errors.power ? (
                      <span className="text-red-400 text-lg">Invalid</span>
                    ) : (
                      formatNumber(results.power)
                    )}
                  </div>
                  <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                    {k}^{n}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12"
        >
          <Card className="border-0 shadow-xl bg-white/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl font-light text-slate-700">About These Calculations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm text-slate-600">
                <div>
                  <h3 className="font-medium text-slate-700 mb-2">Combinations C(n,k)</h3>
                  <p>Number of ways to choose k items from n items where order doesn't matter.</p>
                </div>
                <div>
                  <h3 className="font-medium text-slate-700 mb-2">With Repetition</h3>
                  <p>Number of ways to choose k items from n types where repetition is allowed.</p>
                </div>
                <div>
                  <h3 className="font-medium text-slate-700 mb-2">Permutations P(n,k)</h3>
                  <p>Number of ways to arrange k items from n items where order matters.</p>
                </div>
                <div>
                  <h3 className="font-medium text-slate-700 mb-2">Factorial n!</h3>
                  <p>Product of all positive integers less than or equal to n.</p>
                </div>
                <div>
                  <h3 className="font-medium text-slate-700 mb-2">Derangements !n</h3>
                  <p>Number of permutations where no element appears in its original position.</p>
                </div>
                <div>
                  <h3 className="font-medium text-slate-700 mb-2">Functions (A→B) k^n</h3>
                  <p>Number of functions from a set A of size n to a set B of size k.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
