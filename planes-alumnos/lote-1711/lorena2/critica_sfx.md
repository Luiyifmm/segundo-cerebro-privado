# Critique, round 1

| axis | score | basis |
|---|---|---|
| hook | 10.0 | first sound at 0.00s |
| sync | 10.0 | 21/21 sounds on their frame (peaks, arrivals, or first onsets for clicks) |
| coverage | n/a | 28 cues for 29 declared events (the list is the reference; runs and clusters are thinned on purpose) |
| pacing | 9.7 | 9.7 weighted events per 10 s, longest silence 4.1 s (the original audio fills the gaps it has sounds in) |
| variety | 7.5 | 22 source recordings, 19 families in 26 sounds (runs and interface sounds not counted) |
| hierarchy | 10.0 | 20.9 dB between the loud and the quiet sounds |
| headroom | 10.0 | true peak -1.7 dBTP |
| loudness | 5.0 | final -22.1 LUFS (the author's own balance is kept) |
| balance | 10.0 | the original is silent around 27 of 27 sounds: nothing there to bury or to be buried by |
| mono | 10.0 | the SFX track loses 0.1 dB when folded to mono (0 = the channels agree, 3 = unrelated, 6+ = parts cancel); 0 of 28 sounds lose more than 6 dB; the film loses -0.2 LU in mono against 0.0 LU for the original (-0.2 added) |

**FIX**: lowest axis 5.0 (every axis must reach 8; ok to show)

Three worst problems, fix only these, re-render, run again:
1. variety: 4 takes of the same recording family 'mouse click' (4.90s, 5.81s, 8.53s, 10.35s); mix in other sounds

Listen to these 4 moments, on headphones and then once on a phone speaker. This script cannot hear: they are the places where the numbers above are least certain, and none of them says that it sounds good:
  1.    0.00s  'whoosh': the first sound of the film: the hook; also 'hit' at 0.05s: the highest peak of the film (-2 dBFS before the master). Listen for: does it land with the picture at once, and is it clearly there under the music or the voice? / is it big without hurting on headphones, and does the music under it pump?
  2.    4.45s  'hit x0.50': brought 6 dB down to the perceived level of its role. Listen for: a sound brought down that far can get lost: does it still carry its moment?
  3.    6.71s  'tick': its attack was moved 70 ms so that it lands on the moment. Listen for: does the lead-in still read as part of the sound?
  4.   10.39s  the busiest two seconds (7 sounds). Listen for: is every sound still distinct, or does it turn to mud?
  (--listen-out FILE.wav cuts them into one file of the film's own sound)

Still to judge by eye on review.png: character fit (each sound suits its picture), cleanliness (no mud in the low end under music/voice, nothing masks speech), taste (designed, not sprayed on).
