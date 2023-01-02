<template>
  <div id="container">
    <DigitPainterComponent
      :imageSizeLength="28"
      :squareSizeLength="10"
      :gripLineThickness="0.2"
    />
  </div>
</template>

<script>
import DigitPainterComponent from "@/components/DigitPainterComponent.vue";
export default {
  name: "DigitPainterView",

  components: { DigitPainterComponent },
};
</script>

<style>
#container {
  margin: 30px 10px;
}
</style>