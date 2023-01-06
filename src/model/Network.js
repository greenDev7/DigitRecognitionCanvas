import Neuron from "./Neuron";
import Layer from "./Layer";

export default class Network {
  constructor(hiddenWeights, outputWeights) {
    let HiddenNeurons = [];
    let OutputNeurons = [];

    this.HiddenLayers = [];

    for (let l = 0; l < hiddenWeights.length; l++) {
      for (let i = 0; i < hiddenWeights[l].length; i++)
        HiddenNeurons.push(
          new Neuron(hiddenWeights[l][i].bias, hiddenWeights[l][i].weights)
        );
      this.HiddenLayers.push(new Layer(HiddenNeurons));
    }

    for (let i = 0; i < outputWeights.length; i++)
      OutputNeurons.push(
        new Neuron(outputWeights[i].bias, outputWeights[i].weights)
      );

    this.OutputLayer = new Layer(OutputNeurons);
  }

  makePropagateForward(functionSignal) {
    // Передаем сигнал по скрытым слоям
    for (let hiddenLayer of this.HiddenLayers) {
      functionSignal = hiddenLayer.produceSignals(functionSignal);
    }

    // и возвращаем сигнал от выходного слоя
    return this.OutputLayer.produceSignals(functionSignal);
  }
}
