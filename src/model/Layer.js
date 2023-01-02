export default class Layer {
  constructor(Neurons) {
    this.Neurons = Neurons;
  }

  produceSignals(inputSignals) {
    let currentSignals = [];

    this.Neurons.forEach((neuron) => {
      currentSignals.push(neuron.getActivationPotential(inputSignals));
    });

    return currentSignals;
  }
}
