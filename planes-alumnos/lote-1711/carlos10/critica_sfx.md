# Critique, round 1

| axis | score | basis |
|---|---|---|
| hook | 10.0 | first sound at 0.05s |
| sync | 9.0 | 16/18 sounds on their frame (peaks, arrivals, or first onsets for clicks) |
| coverage | n/a | 33 cues for 33 declared events (the list is the reference; runs and clusters are thinned on purpose) |
| pacing | 7.8 | 3.4 weighted events per 10 s, longest silence 8.1 s; 1 runs of typing/ticks count once (7 sounds) |
| variety | 10.0 | 14 source recordings, 14 families in 14 sounds (runs and interface sounds not counted) |
| hierarchy | 10.0 | 13.9 dB between the loud and the quiet sounds |
| headroom | 10.0 | true peak -4.9 dBTP |
| loudness | 7.0 | final -17.1 LUFS (the author's own balance is kept) |
| balance | 7.0 | median event peak -11 dB vs the original around it, big sounds -12 dB (whole-track gap +13 LU) (18 event(s) on speech left to the speech axis) |
| audibility | 8.7 | 3 of 33 sounds sit more than 30 dB under the film's own sound in the mix (median -20 dB, after the ducking) |
| speech | 10.0 | 0 sound(s) in 0 moment(s) are within 3 dB of the voice or above it (0 above) even after ducking |
| low_end | 10.0 | 0 heavy sound(s) on top of existing bass |
| mono | 10.0 | the SFX track loses 0.5 dB when folded to mono (0 = the channels agree, 3 = unrelated, 6+ = parts cancel); 0 of 33 sounds lose more than 6 dB; the film loses 0.0 LU in mono against 0.0 LU for the original (+0.0 added) |

**FIX**: lowest axis 7.0 (every axis must reach 8; ok to show)

Three worst problems, fix only these, re-render, run again:
1. pacing: nothing happens between 32.05s and 40.15s (8.1 s)
2. balance: median sound is -11 dB under the original, weakest at 0.05s, 10.93s: raise gain_db there (sheet.py gain --db +N --between A B) and render with --no-match-layer: the layer match keeps the whole layer at the loudness of the sound it replaces and takes back a raise that is made on every cue
3. sync: 'pop' at 16.71s peaks -14 ms from the moment

Listen to these 5 moments, on headphones and then once on a phone speaker. This script cannot hear: they are the places where the numbers above are least certain, and none of them says that it sounds good:
  1.    0.05s  'riser': the first sound of the film: the hook; its attack was moved 350 ms so that it lands on the moment. Listen for: does it land with the picture at once, and is it clearly there under the music or the voice? / does the lead-in still read as part of the sound?
  2.   16.71s  'pop': its peak sits -14 ms from the moment. Listen for: does it feel early or late against the picture?
  3.   20.47s  'hit x0.80': the highest peak of the film (-10 dBFS before the master). Listen for: is it big without hurting on headphones, and does the music under it pump?
  4.   30.00s  'riser': the quietest by perceived loudness among the sounds that are not ticks. Listen for: can it be heard at all?
  5.   32.47s  the busiest two seconds (8 sounds). Listen for: is every sound still distinct, or does it turn to mud?
  (--listen-out FILE.wav cuts them into one file of the film's own sound)

Still to judge by eye on review.png: character fit (each sound suits its picture), cleanliness (no mud in the low end under music/voice, nothing masks speech), taste (designed, not sprayed on).
