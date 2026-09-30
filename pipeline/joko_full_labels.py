"""Claude labels per distinct creative for the full joko run. Groups are the distinct
(format, copy, headline, cta, transcript) tuples in order of first appearance in the cleaned file.
(hook, angle, offer, awareness 0-4, cta_strength 0-4, ugc yes/no/unknown)"""
P, U, N = "pain_point", "ugc", None
G = [
 ("bold_claim","desire","direct_offer",2,1,"no"),        # 0
 ("pain_point","pain","direct_offer",1,3,"yes"),         # 1
 ("curiosity","pain","direct_offer",1,3,"no"),           # 2
 ("how_to","desire","direct_offer",2,3,"yes"),           # 3
 ("curiosity","pain","direct_offer",1,3,"unknown"),      # 4
 ("curiosity","pain","direct_offer",1,3,"unknown"),      # 5
 ("bold_claim","desire","direct_offer",2,1,"no"),        # 6
 ("how_to","desire","direct_offer",2,3,"yes"),           # 7
 ("curiosity","curiosity","direct_offer",1,3,"yes"),     # 8
 ("bold_claim","desire","direct_offer",2,2,"no"),        # 9
 ("pain_point","pain","direct_offer",1,3,"yes"),         # 10
 ("curiosity","desire","direct_offer",2,3,"yes"),        # 11
 ("curiosity","curiosity","direct_offer",1,3,"yes"),     # 12
 ("bold_claim","desire","direct_offer",2,1,"unknown"),   # 13
 ("question","desire","direct_offer",1,3,"no"),          # 14
 ("pain_point","pain","direct_offer",1,3,"yes"),         # 15
 ("question","desire","none",1,2,"unknown"),             # 16
 ("bold_claim","desire","direct_offer",2,2,"unknown"),   # 17
 ("pain_point","pain","direct_offer",1,3,"yes"),         # 18
 ("pain_point","pain","direct_offer",1,3,"yes"),         # 19
 ("curiosity","pain","direct_offer",1,3,"unknown"),      # 20
 ("pain_point","pain","direct_offer",1,3,"yes"),         # 21
 ("curiosity","curiosity","direct_offer",1,3,"yes"),     # 22
 ("curiosity","pain","direct_offer",1,3,"unknown"),      # 23
 ("curiosity","curiosity","direct_offer",1,3,"yes"),     # 24
 ("pain_point","pain","direct_offer",1,3,"yes"),         # 25
 ("pain_point","pain","direct_offer",1,3,"yes"),         # 26
 ("question","desire","direct_offer",1,3,"unknown"),     # 27
 ("pain_point","pain","direct_offer",1,3,"yes"),         # 28
 ("curiosity","curiosity","direct_offer",1,3,"yes"),     # 29
 ("curiosity","pain","direct_offer",1,3,"unknown"),      # 30
 ("curiosity","curiosity","direct_offer",1,3,"yes"),     # 31
 ("curiosity","desire","direct_offer",2,3,"yes"),        # 32
 ("curiosity","curiosity","direct_offer",1,3,"yes"),     # 33
 ("bold_claim","desire","direct_offer",2,2,"unknown"),   # 34 (music only)
 ("pain_point","pain","direct_offer",1,3,"yes"),         # 35
 ("bold_claim","desire","direct_offer",2,3,"yes"),       # 36
 ("curiosity","pain","direct_offer",1,3,"no"),           # 37
 ("bold_claim","desire","direct_offer",2,2,"unknown"),   # 38
 ("bold_claim","comparison","direct_offer",2,3,"no"),    # 39 (voice-over)
 ("bold_claim","desire","direct_offer",2,3,"yes"),       # 40
 ("curiosity","desire","direct_offer",2,3,"yes"),        # 41
 ("pain_point","pain","direct_offer",1,3,"yes"),         # 42
 ("pain_point","pain","direct_offer",1,3,"yes"),         # 43
 ("pain_point","pain","direct_offer",1,3,"yes"),         # 44
 ("pain_point","pain","direct_offer",1,3,"yes"),         # 45
 ("curiosity","pain","direct_offer",1,3,"unknown"),      # 46 (music only)
 ("curiosity","pain","direct_offer",1,3,"unknown"),      # 47 (music only)
 ("curiosity","social_proof","direct_offer",3,3,"yes"),  # 48
 ("pain_point","pain","direct_offer",1,3,"yes"),         # 49
 ("how_to","desire","direct_offer",2,3,"yes"),           # 50
 ("bold_claim","desire","direct_offer",2,2,"unknown"),   # 51 (music only)
 ("how_to","desire","direct_offer",2,3,"yes"),           # 52
 ("pain_point","pain","direct_offer",1,3,"yes"),         # 53
 ("curiosity","desire","direct_offer",2,3,"yes"),        # 54
 ("curiosity","desire","direct_offer",2,3,"yes"),        # 55
 ("how_to","desire","direct_offer",2,3,"yes"),           # 56
 ("curiosity","pain","direct_offer",1,3,"yes"),          # 57
 ("how_to","desire","direct_offer",2,3,"yes"),           # 58
 ("pain_point","pain","direct_offer",1,3,"yes"),         # 59
]
