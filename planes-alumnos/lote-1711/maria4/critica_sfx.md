# Critique, round 1

| axis | score | basis |
|---|---|---|
| hook | 10.0 | first sound at 0.00s |
| sync | 7.0 | 46/47 sounds on their frame (peaks, arrivals, or first onsets for clicks); 1 cue(s) missing from the track |
| coverage | n/a | 66 cues for 67 declared events (the list is the reference; runs and clusters are thinned on purpose) |
| pacing | 9.1 | 8.4 weighted events per 10 s, longest silence 6.3 s |
| variety | 6.0 | 40 source recordings, 36 families in 48 sounds (runs and interface sounds not counted) |
| hierarchy | 10.0 | 16.4 dB between the loud and the quiet sounds |
| headroom | 10.0 | true peak -3.3 dBTP |
| loudness | 10.0 | final -15.6 LUFS (the author's own balance is kept) |
| balance | 10.0 | median event peak +0 dB vs the original around it, big sounds +0 dB (whole-track gap +9 LU) (35 event(s) on speech left to the speech axis) |
| audibility | 8.2 | 8 of 63 sounds sit more than 30 dB under the film's own sound in the mix (median -19 dB, after the ducking) |
| speech | 10.0 | 0 sound(s) in 0 moment(s) are within 3 dB of the voice or above it (0 above) even after ducking |
| low_end | 1.0 | 17 heavy sound(s) on top of existing bass |
| mono | 10.0 | the SFX track loses 0.1 dB when folded to mono (0 = the channels agree, 3 = unrelated, 6+ = parts cancel); 0 of 66 sounds lose more than 6 dB; the film loses 0.0 LU in mono against 0.0 LU for the original (+0.0 added) |

**FIX**: lowest axis 1.0 (every axis must reach 8; ok to show)

Three worst problems, fix only these, re-render, run again:
1. variety: ES_Bass Drop - SFX Producer.mp3 is the source of 8 sounds (0.00s, 1.75s, 14.64s, 16.44s, 21.21s, 22.08s, 23.84s, 33.60s); a slice or a pitch step does not make it another sound
2. variety: 8 takes of the same recording family 'es bass drop sfx producer' (0.00s, 1.75s, 14.64s, 16.44s, 21.21s, 22.08s, 23.84s, 33.60s); mix in other sounds
3. render: 'riser x0.50' at 32.08s is missing from the SFX track (lost in the render): run mix.py again, report it if it repeats

Listen to these 5 moments, on headphones and then once on a phone speaker. This script cannot hear: they are the places where the numbers above are least certain, and none of them says that it sounds good:
  1.    0.05s  'hit': brought 6 dB up to the perceived level of its role; also 'whoosh' at 0.00s: the first sound of the film: the hook. Listen for: a thin recording lifted that far can turn harsh: is it clean? / does it land with the picture at once, and is it clearly there under the music or the voice?
  2.    3.55s  'riser x0.50': its attack was moved 350 ms so that it lands on the moment. Listen for: does the lead-in still read as part of the sound?
  3.   22.58s  the busiest two seconds (9 sounds). Listen for: is every sound still distinct, or does it turn to mud?
  4.   25.56s  'click': its peak sits -31 ms from the moment. Listen for: does it feel early or late against the picture?
  5.   32.08s  'riser x0.50': the quietest by perceived loudness among the sounds that are not ticks. Listen for: can it be heard at all?
  (--listen-out FILE.wav cuts them into one file of the film's own sound)

Still to judge by eye on review.png: character fit (each sound suits its picture), cleanliness (no mud in the low end under music/voice, nothing masks speech), taste (designed, not sprayed on).
