# Critique, round 1

| axis | score | basis |
|---|---|---|
| hook | 10.0 | first sound at 0.00s |
| sync | 9.1 | 36/40 sounds on their frame (peaks, arrivals, or first onsets for clicks) |
| coverage | n/a | 53 cues for 53 declared events (the list is the reference; runs and clusters are thinned on purpose) |
| pacing | 7.2 | 5.6 weighted events per 10 s, longest silence 6.1 s |
| variety | 6.8 | 31 source recordings, 29 families in 36 sounds (runs and interface sounds not counted) |
| hierarchy | 10.0 | 19.0 dB between the loud and the quiet sounds |
| headroom | 10.0 | true peak -4.9 dBTP |
| loudness | 10.0 | final -16.9 LUFS (the author's own balance is kept) |
| balance | 10.0 | median event peak -2 dB vs the original around it, big sounds +2 dB (whole-track gap +10 LU) (31 event(s) on speech left to the speech axis) |
| audibility | 8.7 | 5 of 52 sounds sit more than 30 dB under the film's own sound in the mix (median -13 dB, after the ducking) |
| speech | 7.0 | 3 sound(s) in 2 moment(s) are within 3 dB of the voice or above it (3 above) even after ducking |
| low_end | 1.0 | 12 heavy sound(s) on top of existing bass |
| mono | 10.0 | the SFX track loses 0.1 dB when folded to mono (0 = the channels agree, 3 = unrelated, 6+ = parts cancel); 0 of 53 sounds lose more than 6 dB; the film loses 0.0 LU in mono against 0.0 LU for the original (+0.0 added) |

**FIX**: lowest axis 1.0 (every axis must reach 8; ok to show)

Three worst problems, fix only these, re-render, run again:
1. variety: ES_Bass Drop - SFX Producer.mp3 is the source of 5 sounds (13.37s, 19.66s, 32.37s, 37.74s, 41.99s); a slice or a pitch step does not make it another sound
2. variety: 5 takes of the same recording family 'es bass drop sfx producer' (13.37s, 19.66s, 32.37s, 37.74s, 41.99s); mix in other sounds
3. low end: 'hit x0.60' at 13.37s piles onto the bass already there (-24 dB); lower it 11 dB, highpass >= 140 Hz (the check measures 30-140 Hz: 90 Hz is not enough), or drop its sub layer

Listen to these 5 moments, on headphones and then once on a phone speaker. This script cannot hear: they are the places where the numbers above are least certain, and none of them says that it sounds good:
  1.    0.00s  'riser': the first sound of the film: the hook; its attack was moved 350 ms so that it lands on the moment. Listen for: does it land with the picture at once, and is it clearly there under the music or the voice? / does the lead-in still read as part of the sound?
  2.   13.37s  'hit x0.60': brought 6 dB up to the perceived level of its role; the highest peak of the film (-6 dBFS before the master). Listen for: a thin recording lifted that far can turn harsh: is it clean? / is it big without hurting on headphones, and does the music under it pump?
  3.   32.37s  'hit x0.60': its peak sits +65 ms from the moment. Listen for: does it feel early or late against the picture?
  4.   36.44s  the busiest two seconds (9 sounds); also 'riser' at 37.74s: the quietest by perceived loudness among the sounds that are not ticks. Listen for: is every sound still distinct, or does it turn to mud? / can it be heard at all?
  5.   41.84s  'whoosh': 1 sound(s) on top of the voice, +5.0 dB against it. Listen for: is every word still understood?
  (--listen-out FILE.wav cuts them into one file of the film's own sound)

Still to judge by eye on review.png: character fit (each sound suits its picture), cleanliness (no mud in the low end under music/voice, nothing masks speech), taste (designed, not sprayed on).
