<template>

<div class="slug-container cf">
<script src="https://cdnjs.cloudflare.com/ajax/libs/tone/13.8.12/Tone.min.js" defer></script>    
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js" defer></script>    
<script src="https://cdnjs.cloudflare.com/ajax/libs/chance/1.0.18/chance.min.js" defer></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.11/lodash.min.js" defer></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/d3/5.9.2/d3.min.js" defer></script>
<script src="/tonal.min.js" defer></script>

  <article id="post-container w-100">
    <!-- Article header -->
    <header class="ph3-ns w-100">
      <div class="ph2 ph3-ns">
        <h1 :class="['f-headline sans-serif-flyweight lh-solid mv0 mv1-ns']">
          Generative music
        </h1>
      </div>

      <div>
        <div class="mv3 i pa3-ns tc tl-ns w-100 db">Experimenting with chance and tone.js</div>
      </div>

      <div class="bg-dark-gray white pa4 mv2 tc dn">
          <h2 class="ma0 pa2 ba br2 w-two-thirds-l center">This post is in progress</h2>
          <p class="pt3">I would really appreciate your feedback!</p>
          <p class="pa3">Get in touch...</p>
          <h3 class="tracked"><a class="white" href="mailto:ejfox@ejfox.com">ejfox@ejfox.com</a> or <a class="white" href="http://twitter.com/mrejfox">@mrejfox</a> </h3>
      </div>
    </header>

    <section 
      class="ph2 ph4-ns">
      This is where we will put all of the stuff, man
      <button @click="start()">Start</button>
      <button @click="stop()">Stop</button>
      <h2 v-if="playing">Playing</h2>
      <select
        class="db w-100 h5"
        v-model="currentNotes" multiple>
        <option>C2</option>
        <option>C3</option>
        <option>E3</option>
        <option>C4</option>
        <option>C5</option>
      </select>
    </section>
   </article>
</div>
</template>

<script>
import AudioPlayer from '~/components/AudioPlayer.vue';
import Words from '~/components/blogtypes/words.vue'
import Nav from '~/components/Nav.vue';
// import _ from 'lodash'

export default {
  scrollToTop: true,
  components: {
    Nav
  },
  data: function () {
    return {
      emojiIcon: '📓',
      title: 'Genmusic',
      shortDescription: 'Experimenting with generative music...',
      playing: false
      ,possibleKeyCenters: ['A', 'B', 'C', 'C#', 'D', 'E', 'F', 'F#', 'G'] // The possible notes that can be used to determine the key
      ,possibleModes: ['minor', 'major', 'dorian', 'lydian', 'mixolydian', 'phrygian', 'minor pentatonic', 'major pentatonic', 'locrian pentatonic'] // Some hand-picked pleasant modes
      ,minVol: -12,
      modeChoice: null,
      keyCenter: null,
      timeSignature: 4,
      tempo: 120,
      errors: 0,
      currentChord: null,
      swing: 0,
      learning: 0,
      mode: null,
      chordChoices: null,
      polySynth: null,
      currentNote: 'C3',
      currentNotes: ['C1', 'A2', 'D3', 'E4', 'F5']
    }
  },
  computed: {
  }, 
  created: function () {
  },
  activated: function () {
  },
  methods: {
    start: function () {
      Tone.Transport.start()
      this.playing = true
    },
    stop: function () {
      Tone.Transport.stop()
      this.playing = false
    },
    init: function () {
      Tone.Transport.bpm.value = this.tempo
      // Tone.Transport.timeSignature.value = this.timeSignature
      //Tone.Transport.swing.value = this.swing

      this.polySynth = new Tone.PolySynth(6, Tone.Synth).toMaster()
      this.polySynth.set({
        'envelope': {
          attack: 0.01,
          decay: 0.5,
          sustain: 0.4,
          release: 0.1
        },
        'oscillator': {
          type: 'sine'
        }
      })

      // this.polysynth.volume.value = -3
      
      this.loop = new Tone.Loop((time) => {
        this.polySynth.triggerAttackRelease(this.currentNotes, '4n')
      }, '1m').start(0)

      this.loop.iterations = 512
    },
    randomizeSettings: function(level=3) {
      if(level >= 1) {
        this.modeChoice = chance.pick(this.possibleModes)
        this.keyCenter = chance.pick(this.possibleKeyCenters)
        this.tempo = chance.natural({min:72, max:160})
      }
      if (level >= 2) {
        this.timeSignature = chance.pick([2,3,4,6,12])
        this.errors = chance.floating({min:0, max: 92})
      }
      if (level == 3) {
        this.swing = chance.floating({min: 0, max: 92})
        this.learning = chance.floating({min: 0, max: 1})
        this.mode = Tonal.Scale.intervals(this.modeChoice)
        this.chordChoices = Tonal.Scale.chords(this.modeChoice)
      }
    }
  },
  mounted: function () {
    this.randomizeSettings()
    this.init()
  },
  head () {
    return {
      title: this.emojiIcon + ' ' + this.title + ' | EJ Fox',
      meta: [{
        'name': 'EJ Fox | ' + this.title,
        'description': this.shortDescription,
        'og:description': this.shortDescription,
        'og:title': 'EJ Fox | ' + this.title,
        'og:type': 'article',
        'twitter:title': 'EJ Fox | ' + this.title,
        'twitter:creator': 'mrejfox',
        'twitter:description': this.emojiIcon + ' ' + this.shortDescription
      }]
    }
  }
};
</script>

<style scoped>

</style>
