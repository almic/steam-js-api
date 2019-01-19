let csgo = {}

csgo.appID = 730
csgo.structure = {
    "kills": 42799,             // total_kills
    "deaths": 33530,            // total_deaths
    "time": 1773767,            // total_time_played (seconds)
    "bombs": {
        "planted": 1052,        // total_planted_bombs
        "defused": 294          // total_defused_bombs
    },
    "rounds": {
        "won": 17780,           // total_wins
        "pistol": 576,          // total_wins_pistolround
        "played": 28677         // total_rounds_played
    },
    "matches": {
        "won": 4711,            // total_matches_won
        "played": 6061          // total_matches_played
    },
    "demolition": {
        "won": 4147,            // total_trbomb_matches_won
        "bombs": {
            "planted": 40,      // total_TR_planted_bombs
            "defused": 15       // total_TR_defused_bombs
        }
    },
    "gungame": {
        "rounds": {
            "won": 6047,        // total_gun_game_rounds_won
            "played": 6661      // total_gun_game_rounds_played
        },
        "matches": {
            "won": 4179,        // total_gg_matches_won
            "played": 5125      // total_gg_matches_played
        },
        "won": 42,              // total_progressive_matches_won
        "score": 3379,          // total_gun_game_contribution_score
        "lastScore": 0          // last_match_gg_contribution_score
    },
    "shots": 711328,            // total_shots_fired
    "hits": 147816,             // total_shots_hit
    "headshots": 17408,         // total_kills_headshots
    "score": 292317,            // total_contribution_score
    "damage": 6049359,          // total_damage_done
    "money": 63376208,          // total_money_earned
    "mvps": 4118,               // total_mvps
    "rescues": 502,             // total_rescued_hostages
    "sprays": 0,                // total_decal_sprays
    "knife": 611,               // total_kills_knife
    "knifeFight": 177,          // total_kills_knife_fight
    "grenade": 140,             // total_kills_hegrenade
    "burns": 215,               // total_kills_molotov
    "backfire": 1654,           // total_kills_enemy_weapon
    "flashKill": 519,           // total_kills_enemy_blinded
    "snipers": 2946,            // total_kills_against_zoomed_sniper
    "dominations": 1275,        // total_dominations
    "brutality": 1582,          // total_domination_overkills
    "revenges": 433,            // total_revenges
    "donated": 1358,            // total_weapons_donated
    "windows": 121,             // total_broken_windows
    "gun": {
        "glock": {
            "shots": 27847,     // total_shots_glock
            "hits": 5547,       // total_hits_glock
            "kills": 1100       // total_kills_glock
        },
        "deagle": {
            "shots": 21059,     // total_shots_deagle
            "hits": 5916,       // total_hits_deagle
            "kills": 2706       // total_kills_deagle
        },
        "dualies": {
            "shots": 5068,      // total_shots_elite
            "hits": 1309,       // total_hits_elite
            "kills": 309        // total_kills_elite
        },
        "fiveseven": {
            "shots": 10456,     // total_shots_fiveseven
            "hits": 2915,       // total_hits_fiveseven
            "kills": 881        // total_kills_fiveseven
        },
        "xm1014": {
            "shots": 16464,     // total_shots_xm1014
            "hits": 3415,       // total_hits_xm1014
            "kills": 454        // total_kills_xm1014
        },
        "mac10": {
            "shots": 12819,     // total_shots_mac10
            "hits": 2652,       // total_hits_mac10
            "kills": 437        // total_kills_mac10
        },
        "ump45": {
            "shots": 20601,     // total_shots_ump45
            "hits": 4622,       // total_hits_ump45
            "kills": 1002       // total_kills_ump45
        },
        "p90": {
            "shots": 39420,     // total_shots_p90
            "hits": 7366,       // total_hits_p90
            "kills": 1245       // total_kills_p90
        },
        "awp": {
            "shots": 13191,     // total_shots_awp
            "hits": 5109,       // total_hits_awp
            "kills": 4641       // total_kills_awp
        },
        "ak47": {
            "shots": 145411,    // total_shots_ak47
            "hits": 28971,      // total_hits_ak47
            "kills": 8895       // total_kills_ak47
        },
        "aug": {
            "shots": 10921,     // total_shots_aug
            "hits": 2746,       // total_hits_aug
            "kills": 749        // total_kills_aug
        },
        "famas": {
            "shots": 12910,     // total_shots_famas
            "hits": 2809,       // total_hits_famas
            "kills": 598        // total_kills_famas
        },
        "g3sg1": {
            "shots": 3320,      // total_shots_g3sg1
            "hits": 714,        // total_hits_g3sg1
            "kills": 384        // total_kills_g3sg1
        },
        "m249": {
            "shots": 10816,     // total_shots_m249
            "hits": 1440,       // total_hits_m249
            "kills": 358        // total_kills_m249
        },
        "p2000": {
            "shots": 35007,     // total_shots_hkp2000
            "hits": 8679,       // total_hits_hkp2000
            "kills": 2170       // total_kills_hkp2000
        },
        "p250": {
            "shots": 17763,     // total_shots_p250
            "hits": 4538,       // total_hits_p250
            "kills": 1150       // total_kills_p250
        },
        "sg553": {
            "shots": 25719,     // total_shots_sg556
            "hits": 5248,       // total_hits_sg556
            "kills": 1585       // total_kills_sg556
        },
        "scar20": {
            "shots": 3626,      // total_shots_scar20
            "hits": 970,        // total_hits_scar20
            "kills": 539        // total_kills_scar20
        },
        "ssg08": {
            "shots": 4444,      // total_shots_ssg08
            "hits": 1535,       // total_hits_ssg08
            "kills": 852        // total_kills_ssg08
        },
        "mp7": {
            "shots": 15532,     // total_shots_mp7
            "hits": 3700,       // total_hits_mp7
            "kills": 642        // total_kills_mp7
        },
        "mp9": {
            "shots": 8060,      // total_shots_mp9
            "hits": 1915,       // total_hits_mp9
            "kills": 298        // total_kills_mp9
        },
        "nova": {
            "shots": 20228,     // total_shots_nova
            "hits": 4063,       // total_hits_nova
            "kills": 577        // total_kills_nova
        },
        "negev": {
            "shots": 63896,     // total_shots_negev
            "hits": 5518,       // total_hits_negev
            "kills": 1333       // total_kills_negev
        },
        "sawedoff": {
            "shots": 8072,      // total_shots_sawedoff
            "hits": 1571,       // total_hits_sawedoff
            "kills": 259        // total_kills_sawedoff
        },
        "bizon": {
            "shots": 13350,     // total_shots_bizon
            "hits": 3108,       // total_hits_bizon
            "kills": 467        // total_kills_bizon
        },
        "tec9": {
            "shots": 12279,     // total_shots_tec9
            "hits": 2683,       // total_hits_tec9
            "kills": 737        // total_kills_tec9
        },
        "mag7": {
            "shots": 12682,     // total_shots_mag7
            "hits": 3013,       // total_hits_mag7
            "kills": 448        // total_kills_mag7
        },
        "m4a1": {
            "shots": 110824,    // total_shots_m4a1
            "hits": 25856,      // total_hits_m4a1
            "kills": 6491       // total_kills_m4a1
        },
        "galil": {
            "shots": 10343,     // total_shots_galilar
            "hits": 2090,       // total_hits_galilar
            "kills": 504        // total_kills_galilar
        },
        "taser": {
            "shots": 227,       // total_shots_taser
            "hits": 0,          // total_hits_taser
            "kills": 86         // total_kills_taser
        }
    },
    "map": {
        "italy": {
            "rounds": {
                "won": 256,     // total_wins_map_cs_italy
                "played": 287   // total_rounds_map_cs_italy
            }
        },
        "office": {
            "rounds": {
                "won": 216,     // total_wins_map_cs_office
                "played": 399   // total_rounds_map_cs_office
            }
        },
        "aztec": {
            "rounds": {
                "won": 158,     // total_wins_map_de_aztec
                "played": 1654  // total_rounds_map_de_aztec
            }
        },
        "cobble": {
            "rounds": {
                "won": 182,     // total_wins_map_de_cbble
                "played": 355   // total_rounds_map_de_cbble
            }
        },
        "dust2": {
            "rounds": {
                "won": 3039,    // total_wins_map_de_dust2
                "played": 7291  // total_rounds_map_de_dust2
            }
        },
        "dust": {
            "rounds": {
                "won": 133,     // total_wins_map_de_dust
                "played": 151   // total_rounds_map_de_dust
            }
        },
        "inferno": {
            "rounds": {
                "won": 482,     // total_wins_map_de_inferno
                "played": 985   // total_rounds_map_de_inferno
            }
        },
        "nuke": {
            "rounds": {
                "won": 197,     // total_wins_map_de_nuke
                "played": 271   // total_rounds_map_de_nuke
            }
        },
        "piranesi": {
            "rounds": {
                "won": 0,       // total_wins_map_de_piranesi
                "played": 0,    // total_rounds_map_de_piranesi
            }
        },
        "prodigy": {
            "rounds": {
                "won": 0,       // total_wins_map_de_prodigy
                "played": 0     // total_rounds_map_de_prodigy
            }
        },
        "tides": {
            "rounds": {
                "won": 0        // total_wins_map_de_tides
            }
        },
        "train": {
            "matches": {
                "won": 7,       // total_matches_won_train
            },
            "rounds": {
                "won": 191,     // total_wins_map_de_train
                "played": 319   // total_rounds_map_de_train
            }
        },
        "assault": {
            "rounds": {
                "won": 0,       // total_wins_map_cs_assault
                "played": 4     // total_rounds_map_cs_assault
            }
        },
        "lake": {
            "matches": {
                "won": 12       // total_matches_won_lake
            },
            "rounds": {
                "won": 44,      // total_wins_map_de_lake
                "played": 104   // total_rounds_map_de_lake
            }
        },
        "safehouse": {
            "matches": {
                "won": 11       // total_matches_won_safehouse
            },
            "rounds": {
                "won": 37,      // total_wins_map_de_safehouse
                "played": 65    // total_rounds_map_de_safehouse
            }
        },
        "sugarcane": {
            "matches": {
                "won": 3        // total_matches_won_sugarcane
            },
            "rounds": {
                "won": 33,      // total_wins_map_de_sugarcane
                "played": 35    // total_rounds_map_de_sugarcane
            }
        },
        "stmarc": {
            "matches": {
                "won": 8        // total_matches_won_stmarc
            },
            "rounds": {
                "won": 44,      // total_wins_map_de_stmarc
                "played": 78    // total_rounds_map_de_stmarc
            }
        },
        "mill": {
            "rounds": {
                "won": 0        // total_wins_map_de_mill
            }
        },
        "shacks": {
            "rounds": {
                "won": 0        // total_wins_map_de_shacks
            }
        },
        "bank": {
            "matches": {
                "won": 5        // total_matches_won_bank
            },
            "rounds": {
                "won": 8,       // total_wins_map_de_bank
                "played": 8     // total_rounds_map_de_bank
            }
        },
        "alleyway": {
            "rounds": {
                "won": 0        // total_wins_map_de_alleyway
            }
        },
        "depot": {
            "matches": {
                "won": 0        // total_matches_won_depot
            },
            "rounds": {
                "won": 0,       // total_wins_map_de_depot
                "played": 0     // total_rounds_map_de_depot
            }
        },
        "embassy": {
            "matches": {
                "won": 0        // total_matches_won_embassy
            },
            "rounds": {
                "won": 0,       // total_wins_map_de_embassy
                "played": 0     // total_rounds_map_de_embassy
            }
        },
        "shortTrain": {
            "matches": {
                "won": 89       // total_matches_won_shorttrain
            },
            "rounds": {
                "won": 235,     // total_wins_map_de_shorttrain
                "played": 293   // total_rounds_map_de_shorttrain
            }
        },
        "house": {
            "rounds": {
                "won": 5        // total_wins_map_de_house
            }
        },
        "vertigo": {
            "rounds": {
                "won": 6,       // total_wins_map_de_vertigo
                "played": 9     // total_rounds_map_de_vertigo
            }
        },
        "balkan": {
            "rounds": {
                "won": 0,       // total_wins_map_de_balkan
                "played": 0     // total_rounds_map_de_balkan
            }
        },
        "monastery": {
            "rounds": {
                "won": 2,       // total_wins_map_ar_monastery
                "played": 5     // total_rounds_map_ar_monastery
            }
        },
        "shoots": {
            "matches": {
                "won": 14,      // total_matches_won_shoots
            },
            "rounds": {
                "won": 35,      // total_wins_map_ar_shoots
                "played": 48    // total_rounds_map_ar_shoots
            }
        },
        "baggage": {
            "matches": {
                "won": 7        // total_matches_won_baggage
            },
            "rounds": {
                "won": 7,       // total_wins_map_ar_baggage
                "played": 10    // total_rounds_map_ar_baggage
            }
        },
        "militia": {
            "rounds": {
                "won": 0,       // total_wins_map_cs_militia
                "played": 0     // total_rounds_map_cs_militia
            }
        }
    },
    "last": {
        "wins": 7,              // last_match_wins
        "rounds": 23,           // last_match_rounds
        "winsT": 11,            // last_match_t_wins
        "winsCT": 12,           // last_match_ct_wins
        "players": 10,          // last_match_max_players
        "kills": 15,            // last_match_kills
        "deaths": 23,           // last_match_deaths
        "score": 32,            // last_match_contribution_score
        "mvps": 3,              // last_match_mvps
        "weapon": {
            "id": 16,           // last_match_favweapon_id
            "shots": 52,        // last_match_favweapon_shots
            "hits": 15,         // last_match_favweapon_hits
            "kills": 4          // last_match_favweapon_kills
        },
        "damage": 2152,         // last_match_damage
        "spending": 65550,      // last_match_money_spent
        "dominations": 0,       // last_match_dominations
        "revenges": 0           // last_match_revenges
    }
}

// MY OWN RESPONSE, EXAMPLE ONLY
csgo.example = {"name":"ValveTestApp260","count":214,"stats":{"kills":42959,"deaths":33612,"time":1780338,"bombs":{"planted":1056,"defused":295},"rounds":{"won":17840,"pistol":580,"played":28765},"damage":6068789,"money":63585608,"rescues":502,"knife":612,"grenade":141,"gun":{"glock":{"kills":1110,"shots":28008,"hits":5590},"deagle":{"kills":2714,"shots":21090,"hits":5930},"dualies":{"kills":309,"shots":5068,"hits":1309},"fiveseven":{"kills":884,"shots":10505,"hits":2929},"xm1014":{"kills":456,"shots":16518,"hits":3427},"mac10":{"kills":439,"shots":12850,"hits":2663},"ump45":{"kills":1008,"shots":20663,"hits":4639},"p90":{"kills":1251,"shots":39499,"hits":7401},"awp":{"kills":4651,"shots":13214,"hits":5119},"ak47":{"kills":8934,"shots":145820,"hits":29079},"aug":{"kills":749,"shots":10921,"hits":2746},"famas":{"kills":600,"shots":12934,"hits":2815},"g3sg1":{"kills":387,"shots":3338,"hits":719},"m249":{"kills":360,"shots":10843,"hits":1447},"p2000":{"kills":2170,"shots":35007,"hits":8679},"p250":{"hits":4538,"kills":1150,"shots":17763},"sg553":{"kills":1585,"shots":25719,"hits":5248},"scar20":{"hits":970,"kills":539,"shots":3626},"ssg08":{"shots":4444,"hits":1535,"kills":852},"mp7":{"shots":15532,"hits":3700,"kills":642},"mp9":{"kills":298,"shots":8060,"hits":1915},"nova":{"hits":4063,"kills":577,"shots":20228},"negev":{"hits":5118,"kills":1333,"shots":63896},"sawedoff":{"shots":8072,"hits":1571,"kills":259},"bizon":{"shots":13350,"hits":3108,"kills":467},"tec9":{"kills":737,"shots":12279,"hits":2683},"mag7":{"shots":12682,"hits":3013,"kills":448},"m4a1":{"kills":6491,"shots":110824,"hits":25856},"galil":{"kills":504,"shots":10343,"hits":2090},"taser":{"kills":86,"shots":227}},"headshots":17482,"backfire":1662,"map":{"italy":{"rounds":{"won":256,"played":287}},"office":{"rounds":{"won":216,"played":399}},"aztec":{"rounds":{"won":158,"played":165}},"cobble":{"rounds":{"won":182,"played":355}},"dust2":{"rounds":{"won":3039,"played":7291}},"dust":{"rounds":{"won":133,"played":151}},"inferno":{"rounds":{"won":482,"played":985}},"nuke":{"rounds":{"won":197,"played":271}},"train":{"rounds":{"won":191,"played":319},"matches":{"won":7}},"assault":{"rounds":{"played":4}},"lake":{"rounds":{"played":104,"won":44},"matches":{"won":12}},"safehouse":{"rounds":{"played":65,"won":37},"matches":{"won":11}},"sugarcane":{"rounds":{"played":35,"won":33},"matches":{"won":3}},"stmarc":{"rounds":{"played":98,"won":44},"matches":{"won":8}},"bank":{"rounds":{"played":8,"won":8},"matches":{"won":5}},"shortTrain":{"rounds":{"played":293,"won":235},"matches":{"won":89}},"house":{"rounds":{"won":5}},"vertigo":{"rounds":{"won":6,"played":9}},"monastery":{"rounds":{"won":2,"played":5}},"shoots":{"rounds":{"played":48,"won":35},"matches":{"won":14}},"baggage":{"rounds":{"played":10,"won":7},"matches":{"won":7}}},"donated":1370,"windows":121,"flashKill":524,"knifeFight":177,"snipers":2953,"dominations":1284,"brutality":1591,"revenges":435,"hits":148302,"shots":713446,"last":{"winsT":9,"winsCT":12,"wins":16,"players":10,"kills":29,"deaths":13,"mvps":5,"weapon":{"id":7,"shots":118,"hits":34,"kills":12},"damage":3735,"spending":43050,"dominations":0,"revenges":0,"score":55,"rounds":21},"mvps":4136,"demolition":{"bombs":{"planted":40,"defused":15},"won":4147},"gungame":{"rounds":{"won":6058,"played":6682},"matches":{"won":4179,"played":5127},"won":42,"score":3379,"lastScore":0},"matches":{"won":4715,"played":6068},"score":292742,"burns":215,"unknown":{"GI.lesson.csgo_instr_explain_buymenu":16,"GI.lesson.csgo_instr_explain_buyarmor":0,"GI.lesson.csgo_instr_explain_plant_bomb":0,"GI.lesson.csgo_instr_explain_bomb_carrier":1,"GI.lesson.bomb_sites_A":0,"GI.lesson.defuse_planted_bomb":0,"GI.lesson.csgo_instr_explain_follow_bomber":0,"GI.lesson.csgo_instr_explain_pickup_bomb":0,"GI.lesson.csgo_instr_explain_prevent_bomb_pickup":0,"GI.lesson.Csgo_cycle_weapons_kb":16,"GI.lesson.csgo_instr_explain_zoom":16,"GI.lesson.csgo_instr_explain_reload":16,"GI.lesson.tr_explain_plant_bomb":0,"GI.lesson.bomb_sites_B":0,"GI.lesson.version_number":16,"GI.lesson.find_planted_bomb":1,"GI.lesson.csgo_hostage_lead_to_hrz":0,"GI.lesson.csgo_instr_rescue_zone":0,"GI.lesson.csgo_instr_explain_inspect":32}}}

module.exports = csgo
