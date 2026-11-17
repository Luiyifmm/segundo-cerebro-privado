# Critique, round 1

| axis | score | basis |
|---|---|---|
| hook | 10.0 | first sound at 0.03s |
| sync | 8.6 | 32/38 sounds on their frame (peaks, arrivals, or first onsets for clicks) |
| coverage | n/a | 50 cues for 50 declared events (the list is the reference; runs and clusters are thinned on purpose) |
| pacing | 10.0 | 6.0 weighted events per 10 s, longest silence 4.6 s |
| variety | 8.1 | 37 source recordings, 29 families in 40 sounds (runs and interface sounds not counted) |
| hierarchy | 10.0 | 20.1 dB between the loud and the quiet sounds |
| headroom | 10.0 | true peak -1.9 dBTP |
| loudness | 10.0 | final -16.1 LUFS (the author's own balance is kept) |
| balance | 10.0 | median event peak -2 dB vs the original around it, big sounds +0 dB (whole-track gap +3 LU) (36 event(s) on speech left to the speech axis) |
| audibility | 9.2 | 3 of 50 sounds sit more than 30 dB under the film's own sound in the mix (median -14 dB, after the ducking) |
| speech | 8.5 | 1 sound(s) in 1 moment(s) are within 3 dB of the voice or above it (0 above) even after ducking |
| low_end | 1.0 | 8 heavy sound(s) on top of existing bass |
| mono | 10.0 | the SFX track loses 0.2 dB when folded to mono (0 = the channels agree, 3 = unrelated, 6+ = parts cancel); 0 of 50 sounds lose more than 6 dB; the film loses 0.0 LU in mono against 0.0 LU for the original (+0.0 added) |

**FIX**: lowest axis 1.0 (every axis must reach 8; ok to show)

Three worst problems, fix only these, re-render, run again:
1. low end: 'hit' at 1.80s piles onto the bass already there (-26 dB); lower it 9 dB, highpass >= 140 Hz (the check measures 30-140 Hz: 90 Hz is not enough), or drop its sub layer
2. low end: 'hit' at 3.25s piles onto the bass already there (-23 dB); lower it 4 dB, highpass >= 140 Hz (the check measures 30-140 Hz: 90 Hz is not enough), or drop its sub layer
3. speech: 1 sound(s) around 3.25s ('hit' -0.2 dB vs the voice); lower them, shorten them, move into a pause (--voice-depth deep ducks by about 24 dB in speech: check the LUFS of *_sfx_ducked.wav before you use it)

Listen to these 5 moments, on headphones and then once on a phone speaker. This script cannot hear: they are the places where the numbers above are least certain, and none of them says that it sounds good:
  1.    0.03s  'sub_drop': the first sound of the film: the hook. Listen for: does it land with the picture at once, and is it clearly there under the music or the voice?
  2.    3.25s  'hit': 1 sound(s) on top of the voice, -0.2 dB against it; also '' at 4.58s: the busiest two seconds (6 sounds). Listen for: is every word still understood? / is every sound still distinct, or does it turn to mud?
  3.   18.20s  'hit': the highest peak of the film (-2 dBFS before the master). Listen for: is it big without hurting on headphones, and does the music under it pump?
  4.   43.11s  'hit': brought 6 dB down to the perceived level of its role. Listen for: a sound brought down that far can get lost: does it still carry its moment?
  5.   45.65s  'pop': its peak sits +33 ms from the moment. Listen for: does it feel early or late against the picture?
  (--listen-out FILE.wav cuts them into one file of the film's own sound)

Still to judge by eye on review.png: character fit (each sound suits its picture), cleanliness (no mud in the low end under music/voice, nothing masks speech), taste (designed, not sprayed on).

---

# Critique, round 2

| axis | score | basis |
|---|---|---|
| hook | 10.0 | first sound at 0.03s |
| sync | 8.6 | 32/38 sounds on their frame (peaks, arrivals, or first onsets for clicks) |
| coverage | n/a | 50 cues for 50 declared events (the list is the reference; runs and clusters are thinned on purpose) |
| pacing | 10.0 | 6.0 weighted events per 10 s, longest silence 4.6 s |
| variety | 8.1 | 37 source recordings, 29 families in 40 sounds (runs and interface sounds not counted) |
| hierarchy | 10.0 | 17.1 dB between the loud and the quiet sounds |
| headroom | 10.0 | true peak -1.9 dBTP |
| loudness | 10.0 | final -16.1 LUFS (the author's own balance is kept) |
| balance | 10.0 | median event peak -2 dB vs the original around it, big sounds +0 dB (whole-track gap +3 LU) (36 event(s) on speech left to the speech axis) |
| audibility | 9.2 | 3 of 50 sounds sit more than 30 dB under the film's own sound in the mix (median -16 dB, after the ducking) |
| speech | 8.5 | 1 sound(s) in 1 moment(s) are within 3 dB of the voice or above it (0 above) even after ducking |
| low_end | 1.0 | 7 heavy sound(s) on top of existing bass |
| mono | 10.0 | the SFX track loses 0.3 dB when folded to mono (0 = the channels agree, 3 = unrelated, 6+ = parts cancel); 0 of 50 sounds lose more than 6 dB; the film loses 0.0 LU in mono against 0.0 LU for the original (+0.0 added) |

**FIX**: lowest axis 1.0 (every axis must reach 8; ok to show)

Three worst problems, fix only these, re-render, run again:
1. low end: 'hit' at 1.80s piles onto the bass already there (-26 dB); lower it 9 dB, highpass >= 140 Hz (the check measures 30-140 Hz: 90 Hz is not enough), or drop its sub layer
2. low end: 'hit' at 3.25s piles onto the bass already there (-23 dB); lower it 4 dB, highpass >= 140 Hz (the check measures 30-140 Hz: 90 Hz is not enough), or drop its sub layer
3. speech: 1 sound(s) around 3.25s ('hit' -0.2 dB vs the voice); lower them, shorten them, move into a pause (--voice-depth deep ducks by about 24 dB in speech: check the LUFS of *_sfx_ducked.wav before you use it)

Listen to these 5 moments, on headphones and then once on a phone speaker. This script cannot hear: they are the places where the numbers above are least certain, and none of them says that it sounds good:
  1.    0.03s  'sub_drop': the first sound of the film: the hook. Listen for: does it land with the picture at once, and is it clearly there under the music or the voice?
  2.    3.25s  'hit': 1 sound(s) on top of the voice, -0.2 dB against it; also '' at 4.58s: the busiest two seconds (6 sounds). Listen for: is every word still understood? / is every sound still distinct, or does it turn to mud?
  3.   18.20s  'hit': brought 6 dB up to the perceived level of its role. Listen for: a thin recording lifted that far can turn harsh: is it clean?
  4.   45.65s  'pop': its peak sits +33 ms from the moment. Listen for: does it feel early or late against the picture?
  5.   55.66s  'hit': the highest peak of the film (-2 dBFS before the master). Listen for: is it big without hurting on headphones, and does the music under it pump?
  (--listen-out FILE.wav cuts them into one file of the film's own sound)

Still to judge by eye on review.png: character fit (each sound suits its picture), cleanliness (no mud in the low end under music/voice, nothing masks speech), taste (designed, not sprayed on).

---

# Critique, round 3

| axis | score | basis |
|---|---|---|
| hook | 10.0 | first sound at 0.03s |
| sync | 7.6 | 19/26 sounds on their frame (peaks, arrivals, or first onsets for clicks) |
| coverage | n/a | 50 cues for 50 declared events (the list is the reference; runs and clusters are thinned on purpose) |
| pacing | 10.0 | 6.0 weighted events per 10 s, longest silence 3.9 s |
| variety | 2.4 | 31 source recordings, 23 families in 40 sounds (runs and interface sounds not counted) |
| hierarchy | 10.0 | 13.4 dB between the loud and the quiet sounds |
| headroom | 10.0 | true peak -1.9 dBTP |
| loudness | 10.0 | final -16.1 LUFS (the author's own balance is kept) |
| balance | 10.0 | median event peak -4 dB vs the original around it, big sounds -2 dB (whole-track gap +4 LU) (36 event(s) on speech left to the speech axis) |
| audibility | 8.9 | 4 of 50 sounds sit more than 30 dB under the film's own sound in the mix (median -16 dB, after the ducking) |
| speech | 8.5 | 1 sound(s) in 1 moment(s) are within 3 dB of the voice or above it (0 above) even after ducking |
| low_end | 5.5 | 3 heavy sound(s) on top of existing bass |
| mono | 10.0 | the SFX track loses 0.3 dB when folded to mono (0 = the channels agree, 3 = unrelated, 6+ = parts cancel); 0 of 50 sounds lose more than 6 dB; the film loses 0.0 LU in mono against 0.0 LU for the original (+0.0 added) |

**FIX**: lowest axis 2.4 (every axis must reach 8; ok to show)

Three worst problems, fix only these, re-render, run again:
1. variety: 7 takes of the same recording family 'da pop' (20.87s, 28.54s, 30.73s, 45.65s, 47.79s, 50.20s, 1:04.56); mix in other sounds
2. variety: Impact Normal.mp3 is the source of 5 sounds (1.80s, 5.52s, 18.20s, 43.11s, 1:07.99); a slice or a pitch step does not make it another sound
3. low end: 'hit' at 1.80s piles onto the bass already there (-26 dB); lower it 7 dB, highpass >= 140 Hz (the check measures 30-140 Hz: 90 Hz is not enough), or drop its sub layer

Listen to these 5 moments, on headphones and then once on a phone speaker. This script cannot hear: they are the places where the numbers above are least certain, and none of them says that it sounds good:
  1.    0.03s  'sub_drop': the first sound of the film: the hook; the highest peak of the film (-6 dBFS before the master). Listen for: does it land with the picture at once, and is it clearly there under the music or the voice? / is it big without hurting on headphones, and does the music under it pump?
  2.    3.25s  'hit': brought 5 dB down to the perceived level of its role; also '' at 4.58s: the busiest two seconds (6 sounds). Listen for: a sound brought down that far can get lost: does it still carry its moment? / is every sound still distinct, or does it turn to mud?
  3.    6.46s  'pop': the quietest by perceived loudness among the sounds that are not ticks. Listen for: can it be heard at all?
  4.   18.20s  'hit': its peak sits -50 ms from the moment; also 'whoosh' at 18.75s: 1 sound(s) on top of the voice, -1.6 dB against it. Listen for: does it feel early or late against the picture? / is every word still understood?
  5.   30.73s  'pop': its attack was moved 273 ms so that it lands on the moment; also 'hit' at 31.81s: its peak sits -50 ms from the moment. Listen for: does the lead-in still read as part of the sound? / does it feel early or late against the picture?
  (--listen-out FILE.wav cuts them into one file of the film's own sound)

Still to judge by eye on review.png: character fit (each sound suits its picture), cleanliness (no mud in the low end under music/voice, nothing masks speech), taste (designed, not sprayed on).

---

# Critique, round 4

| axis | score | basis |
|---|---|---|
| hook | 10.0 | first sound at 0.03s |
| sync | 9.2 | 29/32 sounds on their frame (peaks, arrivals, or first onsets for clicks) |
| coverage | n/a | 50 cues for 50 declared events (the list is the reference; runs and clusters are thinned on purpose) |
| pacing | 10.0 | 6.0 weighted events per 10 s, longest silence 3.9 s |
| variety | 6.2 | 34 source recordings, 30 families in 40 sounds (runs and interface sounds not counted) |
| hierarchy | 10.0 | 16.7 dB between the loud and the quiet sounds |
| headroom | 10.0 | true peak -1.9 dBTP |
| loudness | 10.0 | final -16.1 LUFS (the author's own balance is kept) |
| balance | 10.0 | median event peak -2 dB vs the original around it, big sounds -0 dB (whole-track gap +4 LU) (36 event(s) on speech left to the speech axis) |
| audibility | 9.2 | 3 of 50 sounds sit more than 30 dB under the film's own sound in the mix (median -16 dB, after the ducking) |
| speech | 8.5 | 1 sound(s) in 1 moment(s) are within 3 dB of the voice or above it (0 above) even after ducking |
| low_end | 4.0 | 4 heavy sound(s) on top of existing bass |
| mono | 10.0 | the SFX track loses 0.4 dB when folded to mono (0 = the channels agree, 3 = unrelated, 6+ = parts cancel); 0 of 50 sounds lose more than 6 dB; the film loses 0.0 LU in mono against 0.0 LU for the original (+0.0 added) |

**FIX**: lowest axis 4.0 (every axis must reach 8; ok to show)

Three worst problems, fix only these, re-render, run again:
1. variety: 5 takes of the same recording family 'sch button' (28.54s, 30.73s, 34.10s, 39.32s, 47.79s); mix in other sounds
2. low end: 'hit' at 1.80s piles onto the bass already there (-26 dB); lower it 9 dB, highpass >= 140 Hz (the check measures 30-140 Hz: 90 Hz is not enough), or drop its sub layer
3. low end: 'hit' at 3.25s piles onto the bass already there (-23 dB); lower it 4 dB, highpass >= 140 Hz (the check measures 30-140 Hz: 90 Hz is not enough), or drop its sub layer

Listen to these 5 moments, on headphones and then once on a phone speaker. This script cannot hear: they are the places where the numbers above are least certain, and none of them says that it sounds good:
  1.    0.03s  'sub_drop': the first sound of the film: the hook. Listen for: does it land with the picture at once, and is it clearly there under the music or the voice?
  2.    3.25s  'hit': 1 sound(s) on top of the voice, -0.6 dB against it; also '' at 4.58s: the busiest two seconds (6 sounds). Listen for: is every word still understood? / is every sound still distinct, or does it turn to mud?
  3.    5.52s  'hit': the highest peak of the film (-4 dBFS before the master); also 'pop' at 6.46s: the quietest by perceived loudness among the sounds that are not ticks. Listen for: is it big without hurting on headphones, and does the music under it pump? / can it be heard at all?
  4.   12.13s  'pop': brought 6 dB up to the perceived level of its role. Listen for: a thin recording lifted that far can turn harsh: is it clean?
  5.  1:02.29  'pop': its peak sits +77 ms from the moment. Listen for: does it feel early or late against the picture?
  (--listen-out FILE.wav cuts them into one file of the film's own sound)

Still to judge by eye on review.png: character fit (each sound suits its picture), cleanliness (no mud in the low end under music/voice, nothing masks speech), taste (designed, not sprayed on).

---

# Critique, round 5

| axis | score | basis |
|---|---|---|
| hook | 10.0 | first sound at 0.03s |
| sync | 9.4 | 30/32 sounds on their frame (peaks, arrivals, or first onsets for clicks) |
| coverage | n/a | 50 cues for 50 declared events (the list is the reference; runs and clusters are thinned on purpose) |
| pacing | 10.0 | 6.0 weighted events per 10 s, longest silence 3.9 s |
| variety | 6.4 | 34 source recordings, 31 families in 40 sounds (runs and interface sounds not counted) |
| hierarchy | 10.0 | 15.7 dB between the loud and the quiet sounds |
| headroom | 10.0 | true peak -1.9 dBTP |
| loudness | 10.0 | final -16.1 LUFS (the author's own balance is kept) |
| balance | 10.0 | median event peak -2 dB vs the original around it, big sounds -0 dB (whole-track gap +4 LU) (36 event(s) on speech left to the speech axis) |
| audibility | 9.2 | 3 of 50 sounds sit more than 30 dB under the film's own sound in the mix (median -17 dB, after the ducking) |
| speech | 8.5 | 1 sound(s) in 1 moment(s) are within 3 dB of the voice or above it (0 above) even after ducking |
| low_end | 5.5 | 3 heavy sound(s) on top of existing bass |
| mono | 10.0 | the SFX track loses 0.4 dB when folded to mono (0 = the channels agree, 3 = unrelated, 6+ = parts cancel); 0 of 50 sounds lose more than 6 dB; the film loses 0.0 LU in mono against 0.0 LU for the original (+0.0 added) |

**FIX**: lowest axis 5.5 (every axis must reach 8; ok to show)

Three worst problems, fix only these, re-render, run again:
1. low end: 'hit' at 1.80s piles onto the bass already there (-26 dB); lower it 9 dB, highpass >= 140 Hz (the check measures 30-140 Hz: 90 Hz is not enough), or drop its sub layer
2. low end: 'hit' at 3.25s piles onto the bass already there (-23 dB); lower it 4 dB, highpass >= 140 Hz (the check measures 30-140 Hz: 90 Hz is not enough), or drop its sub layer
3. variety: Impact Normal.mp3 is the source of 3 sounds (1.80s, 5.52s, 1:08.03); a slice or a pitch step does not make it another sound

Listen to these 5 moments, on headphones and then once on a phone speaker. This script cannot hear: they are the places where the numbers above are least certain, and none of them says that it sounds good:
  1.    0.03s  'sub_drop': the first sound of the film: the hook. Listen for: does it land with the picture at once, and is it clearly there under the music or the voice?
  2.    3.25s  'hit': 1 sound(s) on top of the voice, -0.6 dB against it; also '' at 4.58s: the busiest two seconds (6 sounds). Listen for: is every word still understood? / is every sound still distinct, or does it turn to mud?
  3.    5.52s  'hit': the highest peak of the film (-4 dBFS before the master); also 'pop' at 6.46s: the quietest by perceived loudness among the sounds that are not ticks. Listen for: is it big without hurting on headphones, and does the music under it pump? / can it be heard at all?
  4.   20.87s  'pop': brought 6 dB up to the perceived level of its role. Listen for: a thin recording lifted that far can turn harsh: is it clean?
  5.   31.85s  'hit': its peak sits -50 ms from the moment. Listen for: does it feel early or late against the picture?
  -> /private/tmp/claude-501/-Users-luiyi-EDICION/e56e3b49-fb3b-4484-a3bc-33ed251ac751/scratchpad/camilo/sfx/r5/escuchar.wav: the 5 in this order, 3 s each

Still to judge by eye on review.png: character fit (each sound suits its picture), cleanliness (no mud in the low end under music/voice, nothing masks speech), taste (designed, not sprayed on).

---

# Critique, round 6

| axis | score | basis |
|---|---|---|
| hook | 10.0 | first sound at 0.03s |
| sync | 9.7 | 31/32 sounds on their frame (peaks, arrivals, or first onsets for clicks) |
| coverage | n/a | 50 cues for 50 declared events (the list is the reference; runs and clusters are thinned on purpose) |
| pacing | 10.0 | 6.0 weighted events per 10 s, longest silence 3.9 s |
| variety | 7.9 | 35 source recordings, 30 families in 40 sounds (runs and interface sounds not counted) |
| hierarchy | 10.0 | 15.7 dB between the loud and the quiet sounds |
| headroom | 10.0 | true peak -1.9 dBTP |
| loudness | 10.0 | final -16.1 LUFS (the author's own balance is kept) |
| balance | 10.0 | median event peak -2 dB vs the original around it, big sounds -0 dB (whole-track gap +4 LU) (36 event(s) on speech left to the speech axis) |
| audibility | 9.2 | 3 of 50 sounds sit more than 30 dB under the film's own sound in the mix (median -17 dB, after the ducking) |
| speech | 8.5 | 1 sound(s) in 1 moment(s) are within 3 dB of the voice or above it (0 above) even after ducking |
| low_end | 5.5 | 3 heavy sound(s) on top of existing bass |
| mono | 10.0 | the SFX track loses 0.4 dB when folded to mono (0 = the channels agree, 3 = unrelated, 6+ = parts cancel); 0 of 50 sounds lose more than 6 dB; the film loses 0.0 LU in mono against 0.0 LU for the original (+0.0 added) |

**FIX**: lowest axis 5.5 (every axis must reach 8; ok to show)

Three worst problems, fix only these, re-render, run again:
1. low end: 'hit' at 1.80s piles onto the bass already there (-26 dB); lower it 9 dB, highpass >= 140 Hz (the check measures 30-140 Hz: 90 Hz is not enough), or drop its sub layer
2. low end: 'hit' at 3.25s piles onto the bass already there (-23 dB); lower it 4 dB, highpass >= 140 Hz (the check measures 30-140 Hz: 90 Hz is not enough), or drop its sub layer
3. sync: 'hit' at 31.85s peaks -50 ms from the moment

Listen to these 5 moments, on headphones and then once on a phone speaker. This script cannot hear: they are the places where the numbers above are least certain, and none of them says that it sounds good:
  1.    0.03s  'sub_drop': the first sound of the film: the hook. Listen for: does it land with the picture at once, and is it clearly there under the music or the voice?
  2.    3.25s  'hit': 1 sound(s) on top of the voice, -0.6 dB against it; also '' at 4.58s: the busiest two seconds (6 sounds). Listen for: is every word still understood? / is every sound still distinct, or does it turn to mud?
  3.    5.52s  'hit': the highest peak of the film (-4 dBFS before the master); also 'pop' at 6.46s: the quietest by perceived loudness among the sounds that are not ticks. Listen for: is it big without hurting on headphones, and does the music under it pump? / can it be heard at all?
  4.   31.85s  'hit': its peak sits -50 ms from the moment. Listen for: does it feel early or late against the picture?
  5.   45.65s  'pop': brought 6 dB up to the perceived level of its role. Listen for: a thin recording lifted that far can turn harsh: is it clean?
  -> /private/tmp/claude-501/-Users-luiyi-EDICION/e56e3b49-fb3b-4484-a3bc-33ed251ac751/scratchpad/camilo/sfx/r6/escuchar.wav: the 5 in this order, 3 s each

Still to judge by eye on review.png: character fit (each sound suits its picture), cleanliness (no mud in the low end under music/voice, nothing masks speech), taste (designed, not sprayed on).

---

# Critique, round 7

| axis | score | basis |
|---|---|---|
| hook | 10.0 | first sound at 0.03s |
| sync | 9.7 | 32/33 sounds on their frame (peaks, arrivals, or first onsets for clicks) |
| coverage | n/a | 49 cues for 50 declared events (the list is the reference; runs and clusters are thinned on purpose) |
| pacing | 10.0 | 5.8 weighted events per 10 s, longest silence 3.9 s |
| variety | 7.8 | 34 source recordings, 29 families in 39 sounds (runs and interface sounds not counted) |
| hierarchy | 10.0 | 15.4 dB between the loud and the quiet sounds |
| headroom | 10.0 | true peak -1.9 dBTP |
| loudness | 10.0 | final -16.1 LUFS (the author's own balance is kept) |
| balance | 10.0 | median event peak -0 dB vs the original around it, big sounds -0 dB (whole-track gap +6 LU) (35 event(s) on speech left to the speech axis) |
| audibility | 9.1 | 3 of 49 sounds sit more than 30 dB under the film's own sound in the mix (median -17 dB, after the ducking) |
| speech | 8.5 | 1 sound(s) in 1 moment(s) are within 3 dB of the voice or above it (0 above) even after ducking |
| low_end | 5.5 | 3 heavy sound(s) on top of existing bass |
| mono | 10.0 | the SFX track loses 0.4 dB when folded to mono (0 = the channels agree, 3 = unrelated, 6+ = parts cancel); 0 of 49 sounds lose more than 6 dB; the film loses 0.0 LU in mono against 0.0 LU for the original (+0.0 added) |

**FIX**: lowest axis 5.5 (every axis must reach 8; ok to show)

Three worst problems, fix only these, re-render, run again:
1. low end: 'hit' at 1.80s piles onto the bass already there (-26 dB); lower it 9 dB, highpass >= 140 Hz (the check measures 30-140 Hz: 90 Hz is not enough), or drop its sub layer
2. low end: 'hit' at 3.25s piles onto the bass already there (-23 dB); lower it 4 dB, highpass >= 140 Hz (the check measures 30-140 Hz: 90 Hz is not enough), or drop its sub layer
3. sync: 'hit' at 31.85s peaks -50 ms from the moment

Listen to these 5 moments, on headphones and then once on a phone speaker. This script cannot hear: they are the places where the numbers above are least certain, and none of them says that it sounds good:
  1.    0.03s  'sub_drop': the first sound of the film: the hook. Listen for: does it land with the picture at once, and is it clearly there under the music or the voice?
  2.    3.25s  'hit': 1 sound(s) on top of the voice, -0.6 dB against it; also '' at 4.58s: the busiest two seconds (6 sounds). Listen for: is every word still understood? / is every sound still distinct, or does it turn to mud?
  3.    5.52s  'hit': the highest peak of the film (-4 dBFS before the master). Listen for: is it big without hurting on headphones, and does the music under it pump?
  4.   31.85s  'hit': its peak sits -50 ms from the moment. Listen for: does it feel early or late against the picture?
  5.   45.65s  'pop': brought 6 dB up to the perceived level of its role. Listen for: a thin recording lifted that far can turn harsh: is it clean?
  (--listen-out FILE.wav cuts them into one file of the film's own sound)

Still to judge by eye on review.png: character fit (each sound suits its picture), cleanliness (no mud in the low end under music/voice, nothing masks speech), taste (designed, not sprayed on).