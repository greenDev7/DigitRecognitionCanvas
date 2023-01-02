export default class Neuron {
  constructor(Bias, Weights) {
    this.Bias = Bias;
    this.Weights = Weights;
  }

  getInducedLocalField(functionSignal) {
    let inducedLocalField = 0.0;

    for (let i = 0; i < functionSignal.length; i++)
      inducedLocalField += functionSignal[i] * this.Weights[i];

    return inducedLocalField;
  }

  sigmoidFunction(x) {
    return 1.0 / (1.0 + Math.pow(Math.E, -x));
  }

  thresholdFunction(x) {
    return x >= 0.0 ? 1.0 : 0.0;
  }

  getActivationPotential(functionSignal) {
    let inducedLocalField = this.getInducedLocalField(functionSignal);
    return this.sigmoidFunction(inducedLocalField + this.Bias);
  }
}
