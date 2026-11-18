# Critique, round 1

| axis | score | basis |
|---|---|---|
| hook | 10.0 | first sound at 0.00s |
| sync | 9.6 | 21/22 sounds on their frame (peaks, arrivals, or first onsets for clicks) |
| coverage | n/a | 27 cues for 27 declared events (the list is the reference; runs and clusters are thinned on purpose) |
| pacing | 7.1 | 3.5 weighted events per 10 s, longest silence 9.1 s |
| variety | 10.0 | 11 source recordings, 11 families in 11 sounds (runs and interface sounds not counted) |
| hierarchy | 10.0 | 8.9 dB between the loud and the quiet sounds |
| headroom | 10.0 | true peak -5.0 dBTP |
| loudness | 10.0 | final -16.7 LUFS (the author's own balance is kept) |
| balance | 10.0 | median event peak -9 dB vs the original around it, big sounds -8 dB (whole-track gap +14 LU) (16 event(s) on speech left to the speech axis) |
| audibility | 8.4 | 3 of 26 sounds sit more than 30 dB under the film's own sound in the mix (median -20 dB, after the ducking) |
| speech | 7.0 | 2 sound(s) in 2 moment(s) are within 3 dB of the voice or above it (2 above) even after ducking |
| low_end | 10.0 | 0 heavy sound(s) on top of existing bass |
| mono | 10.0 | the SFX track loses 0.4 dB when folded to mono (0 = the channels agree, 3 = unrelated, 6+ = parts cancel); 0 of 27 sounds lose more than 6 dB; the film loses 0.0 LU in mono against 0.0 LU for the original (+0.0 added) |

**FIX**: lowest axis 7.0 (every axis must reach 8; ok to show)

Three worst problems, fix only these, re-render, run again:
1. pacing: nothing happens between 19.43s and 28.53s (9.1 s)
2. speech: 1 sound(s) around 19.43s ('whoosh' +6.3 dB vs the voice); lower them, shorten them, move into a pause (--voice-depth deep ducks by about 24 dB in speech: check the LUFS of *_sfx_ducked.wav before you use it)
3. speech: 1 sound(s) around 35.97s ('hit x0.70' +5.5 dB vs the voice); lower them, shorten them, move into a pause (--voice-depth deep ducks by about 24 dB in speech: check the LUFS of *_sfx_ducked.wav before you use it)

Listen to these 5 moments, on headphones and then once on a phone speaker. This script cannot hear: they are the places where the numbers above are least certain, and none of them says that it sounds good:
  1.    0.00s  'riser': the first sound of the film: the hook; its attack was moved 350 ms so that it lands on the moment. Listen for: does it land with the picture at once, and is it clearly there under the music or the voice? / does the lead-in still read as part of the sound?
  2.   15.21s  'pop': its peak sits -14 ms from the moment. Listen for: does it feel early or late against the picture?
  3.   19.43s  'whoosh': 1 sound(s) on top of the voice, +6.3 dB against it. Listen for: is every word still understood?
  4.   32.37s  'click': the highest peak of the film (-8 dBFS before the master). Listen for: is it big without hurting on headphones, and does the music under it pump?
  5.   48.11s  'swoosh': brought 6 dB up to the perceived level of its role. Listen for: a thin recording lifted that far can turn harsh: is it clean?
  (--listen-out FILE.wav cuts them into one file of the film's own sound)

Still to judge by eye on review.png: character fit (each sound suits its picture), cleanliness (no mud in the low end under music/voice, nothing masks speech), taste (designed, not sprayed on).
