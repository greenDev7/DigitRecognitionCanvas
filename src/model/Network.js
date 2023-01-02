import Neuron from "./Neuron";
import Layer from "./Layer";

export default class Network {
  constructor(hidenWeights, outputWeights) {
    let HiddenNeurons = [];
    let OutputNeurons = [];

    for (let i = 0; i < hidenWeights.length; i++)
      HiddenNeurons.push(
        new Neuron(hidenWeights[i].bias, hidenWeights[i].weights)
      );

    for (let i = 0; i < outputWeights.length; i++)
      OutputNeurons.push(
        new Neuron(outputWeights[i].bias, outputWeights[i].weights)
      );

    this.HiddenLayer = new Layer(HiddenNeurons);
    this.OutputLayer = new Layer(OutputNeurons);
  }

  makePropagateForward(functionSignal) {
    // Сначала пропускаем сигнал через скрытый слой (35 нейронов)
    functionSignal = this.HiddenLayer.produceSignals(functionSignal);
    // и возвращаем сигнал от выходного слоя (10 нейронов)
    return this.OutputLayer.produceSignals(functionSignal);
  }
}
