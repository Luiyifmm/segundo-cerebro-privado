# Critique, round 1

| axis | score | basis |
|---|---|---|
| hook | 10.0 | first sound at 0.00s |
| sync | 9.7 | 33/34 sounds on their frame (peaks, arrivals, or first onsets for clicks) |
| coverage | n/a | 45 cues for 48 declared events (the list is the reference; runs and clusters are thinned on purpose) |
| pacing | 10.0 | 5.1 weighted events per 10 s, longest silence 4.8 s; 1 runs of typing/ticks count once (3 sounds) |
| variety | 7.3 | 20 source recordings, 20 families in 24 sounds (runs and interface sounds not counted) |
| hierarchy | 10.0 | 18.5 dB between the loud and the quiet sounds |
| headroom | 10.0 | true peak -3.2 dBTP |
| loudness | 10.0 | final -16.8 LUFS (the author's own balance is kept) |
| balance | 10.0 | median event peak -0 dB vs the original around it, big sounds +1 dB (whole-track gap +10 LU) (30 event(s) on speech left to the speech axis) |
| audibility | 9.3 | 2 of 42 sounds sit more than 30 dB under the film's own sound in the mix (median -13 dB, after the ducking) |
| speech | 8.5 | 1 sound(s) in 1 moment(s) are within 3 dB of the voice or above it (0 above) even after ducking |
| low_end | 1.0 | 10 heavy sound(s) on top of existing bass |
| mono | 10.0 | the SFX track loses 0.1 dB when folded to mono (0 = the channels agree, 3 = unrelated, 6+ = parts cancel); 0 of 45 sounds lose more than 6 dB; the film loses 0.0 LU in mono against 0.0 LU for the original (+0.0 added) |

**FIX**: lowest axis 1.0 (every axis must reach 8; ok to show)

Three worst problems, fix only these, re-render, run again:
1. variety: ES_Bass Drop - SFX Producer.mp3 is the source of 5 sounds (0.02s, 7.18s, 27.13s, 29.95s, 33.10s); a slice or a pitch step does not make it another sound
2. variety: 5 takes of the same recording family 'es bass drop sfx producer' (0.02s, 7.18s, 27.13s, 29.95s, 33.10s); mix in other sounds
3. low end: 'sub_drop' at 0.02s piles onto the bass already there (-21 dB); lower it 14 dB, highpass >= 140 Hz (the check measures 30-140 Hz: 90 Hz is not enough), or drop its sub layer

Listen to these 5 moments, on headphones and then once on a phone speaker. This script cannot hear: they are the places where the numbers above are least certain, and none of them says that it sounds good:
  1.    0.05s  'hit': brought 6 dB up to the perceived level of its role; also 'whoosh' at 0.00s: the first sound of the film: the hook. Listen for: a thin recording lifted that far can turn harsh: is it clean? / does it land with the picture at once, and is it clearly there under the music or the voice?
  2.    6.15s  'riser': its attack was moved 350 ms so that it lands on the moment; also '' at 5.80s: the busiest two seconds (6 sounds). Listen for: does the lead-in still read as part of the sound? / is every sound still distinct, or does it turn to mud?
  3.   13.26s  'whoosh': 1 sound(s) on top of the voice, -0.7 dB against it. Listen for: is every word still understood?
  4.   19.77s  'pop': its peak sits -14 ms from the moment. Listen for: does it feel early or late against the picture?
  5.   29.95s  'magic': the quietest by perceived loudness among the sounds that are not ticks. Listen for: can it be heard at all?
  (--listen-out FILE.wav cuts them into one file of the film's own sound)

Still to judge by eye on review.png: character fit (each sound suits its picture), cleanliness (no mud in the low end under music/voice, nothing masks speech), taste (designed, not sprayed on).
