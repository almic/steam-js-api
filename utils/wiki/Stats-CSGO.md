# Stat Structure for CSGO

## What is this?

The custom stat object structure for this game. Instead of using the original names from
the Web API, you have to use these names to access data about the player.

Why? Because the data from the Steam Web API is very shallow, and stupidly returns an array
of objects instead of a single object with many properties. All stats are converted to a single
object in this library, making it a lot easier to access the data. This improves your experience
when working with stats. In the Steam Web API, some names aren't very obvious, some data tracks
totally different values than the schema suggests, and some stats are literally never tracked
despite being in the schema. To fix that problem, a custom object definition is required.

With a custom object definition, names are more accurate, data is easier to access, and it
offers some extra documentation for the original stat names in the Web API. If you want to create a
custom object definition for your game, go ahead and check out the `json` folder in the
repository, and review the `stats.json` file and the `specs/csgo.js` file to see how it works.
Once you built a similar structure, go ahead and create a pull-request to add it to the project.

## NOTICE

Due to the nature of the Web API, and to save space, unset stats are not returned in
these objects. It's possible for a stat to be tracked, but not yet set for the player. This is true
for achievements; any non-unlocked achievements will simply not be returned by the Web API at all.
The same goes for stats. Before attempting to access any values, check that the exact path of
objects already exists. Also remember that certain stats can have default values, so if they are
unset, you should assume the default value specified in the schema as its true value.

## Structure

> **Integer `kills`**  
> Kills  
>
> **Integer `deaths`**  
> Deaths  
>
> **Integer `time`**  
> Time played  
>
> **Object `bombs`**  
>   
>> **Integer `planted`**  
>> Bombs planted  
>
>> **Integer `defused`**  
>> Bombs defused  
>
> **Object `rounds`**  
>   
>> **Integer `won`**  
>> Rounds won  
>
>> **Integer `pistol`**  
>> Pistol rounds won  
>
>> **Integer `played`**  
>> Rounds played  
>
> **Object `matches`**  
>   
>> **Integer `won`**  
>> Matches won  
>
>> **Integer `played`**  
>> Matches played  
>
> **Object `demolition`**  
>   
>> **Integer `won`**  
>> Demolition matches won  
>
>> **Object `bombs`**  
>>   
>>> **Integer `planted`**  
>>> Bombs planted in Demolition  
>>
>>> **Integer `defused`**  
>>> Bombs defused in Demolition  
>
> **Object `gungame`**  
>   
>> **Object `rounds`**  
>>   
>>> **Integer `won`**  
>>> Arms Race rounds won  
>>
>>> **Integer `played`**  
>>> Arms Race rounds played  
>
>> **Object `matches`**  
>>   
>>> **Integer `won`**  
>>> Arms Race matches won  
>>
>>> **Integer `played`**  
>>> Arms Race matches played  
>
>> **Integer `won`**  
>> Arms Race matches won  
>
>> **Integer `score`**  
>> Total score in Arms Race  
>
>> **Integer `lastScore`**  
>> Score in last Arms Race match  
>
> **Integer `shots`**  
> Total shots  
>
> **Integer `hits`**  
> Total hits  
>
> **Integer `headshots`**  
> Headshot kills  
>
> **Integer `score`**  
> Total score  
>
> **Integer `damage`**  
> Damage dealt  
>
> **Integer `money`**  
> Money earned  
>
> **Integer `mvps`**  
> Total MVPs  
>
> **Integer `rescues`**  
> Hostages rescued  
>
> **Integer `sprays`**  
> Graffiti sprays (not tracked)  
>
> **Integer `knife`**  
> Knife kills  
>
> **Integer `knifeFight`**  
> Knife fight kills  
>
> **Integer `grenade`**  
> Grenade kills  
>
> **Integer `burns`**  
> Incendiary kills  
>
> **Integer `backfire`**  
> Kills with enemy's own weapon  
>
> **Integer `flashKill`**  
> Kills on blind enemy  
>
> **Integer `snipers`**  
> Kills on scoped snipers  
>
> **Integer `dominations`**  
> Dominations  
>
> **Integer `brutality`**  
> Kills on dominated enemy  
>
> **Integer `revenges`**  
> Kills on dominating enemy  
>
> **Integer `donated`**  
> Donated weapons  
>
> **Integer `windows`**  
> Windows broken  
>
> **Object `gun`**  
>   
>> **Object `glock`**  
>>   
>>> **Integer `shots`**  
>>> Glock-18 shots  
>>
>>> **Integer `hits`**  
>>> Glock-18 hits  
>>
>>> **Integer `kills`**  
>>> Glock-18 kills  
>
>> **Object `deagle`**  
>>   
>>> **Integer `shots`**  
>>> Desert Eagle shots  
>>
>>> **Integer `hits`**  
>>> Desert Eagle hits  
>>
>>> **Integer `kills`**  
>>> Desert Eagle kills  
>
>> **Object `dualies`**  
>>   
>>> **Integer `shots`**  
>>> Dual Beretta shots  
>>
>>> **Integer `hits`**  
>>> Dual Beretta hits  
>>
>>> **Integer `kills`**  
>>> Dual Beretta kills  
>
>> **Object `fiveseven`**  
>>   
>>> **Integer `shots`**  
>>> Five-SeveN shots  
>>
>>> **Integer `hits`**  
>>> Five-SeveN hits  
>>
>>> **Integer `kills`**  
>>> Five-SeveN kills  
>
>> **Object `xm1014`**  
>>   
>>> **Integer `shots`**  
>>> XM1014 shots  
>>
>>> **Integer `hits`**  
>>> XM1014 hits  
>>
>>> **Integer `kills`**  
>>> XM1014 kills  
>
>> **Object `mac10`**  
>>   
>>> **Integer `shots`**  
>>> MAC-10 shots  
>>
>>> **Integer `hits`**  
>>> MAC-10 hits  
>>
>>> **Integer `kills`**  
>>> MAC-10 kills  
>
>> **Object `ump45`**  
>>   
>>> **Integer `shots`**  
>>> UMP-45 shots  
>>
>>> **Integer `hits`**  
>>> UMP-45 hits  
>>
>>> **Integer `kills`**  
>>> UMP-45 kills  
>
>> **Object `p90`**  
>>   
>>> **Integer `shots`**  
>>> P90 shots  
>>
>>> **Integer `hits`**  
>>> P90 hits  
>>
>>> **Integer `kills`**  
>>> P90 kills  
>
>> **Object `awp`**  
>>   
>>> **Integer `shots`**  
>>> AWP shots  
>>
>>> **Integer `hits`**  
>>> AWP hits  
>>
>>> **Integer `kills`**  
>>> AWP kills  
>
>> **Object `ak47`**  
>>   
>>> **Integer `shots`**  
>>> AK-47 shots  
>>
>>> **Integer `hits`**  
>>> AK-47 hits  
>>
>>> **Integer `kills`**  
>>> AK-47 kills  
>
>> **Object `aug`**  
>>   
>>> **Integer `shots`**  
>>> AUG shots  
>>
>>> **Integer `hits`**  
>>> AUG hits  
>>
>>> **Integer `kills`**  
>>> AUG kills  
>
>> **Object `famas`**  
>>   
>>> **Integer `shots`**  
>>> FAMAS shots  
>>
>>> **Integer `hits`**  
>>> FAMAS hits  
>>
>>> **Integer `kills`**  
>>> FAMAS kills  
>
>> **Object `g3sg1`**  
>>   
>>> **Integer `shots`**  
>>> G3SG1 shots  
>>
>>> **Integer `hits`**  
>>> G3SG1 hits  
>>
>>> **Integer `kills`**  
>>> G3SG1 kills  
>
>> **Object `m249`**  
>>   
>>> **Integer `shots`**  
>>> M249 shots  
>>
>>> **Integer `hits`**  
>>> M249 hits  
>>
>>> **Integer `kills`**  
>>> M249 kills  
>
>> **Object `p2000`**  
>>   
>>> **Integer `shots`**  
>>> P2000 & USP-S shots  
>>
>>> **Integer `hits`**  
>>> P2000 & USP-S hits  
>>
>>> **Integer `kills`**  
>>> P2000 & USP-S kills  
>
>> **Object `p250`**  
>>   
>>> **Integer `shots`**  
>>> P250 shots  
>>
>>> **Integer `hits`**  
>>> P250 hits  
>>
>>> **Integer `kills`**  
>>> P250 kills  
>
>> **Object `sg553`**  
>>   
>>> **Integer `shots`**  
>>> SG 553 shots  
>>
>>> **Integer `hits`**  
>>> SG 553 hits  
>>
>>> **Integer `kills`**  
>>> SG 553 kills  
>
>> **Object `scar20`**  
>>   
>>> **Integer `shots`**  
>>> SCAR-20 shots  
>>
>>> **Integer `hits`**  
>>> SCAR-20 hits  
>>
>>> **Integer `kills`**  
>>> SCAR-20 kills  
>
>> **Object `ssg08`**  
>>   
>>> **Integer `shots`**  
>>> SSG 08 shots  
>>
>>> **Integer `hits`**  
>>> SSG 08 hits  
>>
>>> **Integer `kills`**  
>>> SSG 08 kills  
>
>> **Object `mp7`**  
>>   
>>> **Integer `shots`**  
>>> MP7 shots  
>>
>>> **Integer `hits`**  
>>> MP7 hits  
>>
>>> **Integer `kills`**  
>>> MP7 kills  
>
>> **Object `mp9`**  
>>   
>>> **Integer `shots`**  
>>> MP9 shots  
>>
>>> **Integer `hits`**  
>>> MP9 hits  
>>
>>> **Integer `kills`**  
>>> MP9 kills  
>
>> **Object `nova`**  
>>   
>>> **Integer `shots`**  
>>> Nova shots  
>>
>>> **Integer `hits`**  
>>> Nova hits  
>>
>>> **Integer `kills`**  
>>> Nova kills  
>
>> **Object `negev`**  
>>   
>>> **Integer `shots`**  
>>> Negev shots  
>>
>>> **Integer `hits`**  
>>> Negev hits  
>>
>>> **Integer `kills`**  
>>> Negev kills  
>
>> **Object `sawedoff`**  
>>   
>>> **Integer `shots`**  
>>> Sawed-Off shots  
>>
>>> **Integer `hits`**  
>>> Sawed-Off hits  
>>
>>> **Integer `kills`**  
>>> Sawed-Off kills  
>
>> **Object `bizon`**  
>>   
>>> **Integer `shots`**  
>>> PP-Bizon shots  
>>
>>> **Integer `hits`**  
>>> PP-Bizon hits  
>>
>>> **Integer `kills`**  
>>> PP-Bizon kills  
>
>> **Object `tec9`**  
>>   
>>> **Integer `shots`**  
>>> Tec-9 shots  
>>
>>> **Integer `hits`**  
>>> Tec-9 hits  
>>
>>> **Integer `kills`**  
>>> Tec-9 kills  
>
>> **Object `mag7`**  
>>   
>>> **Integer `shots`**  
>>> MAG-7 shots  
>>
>>> **Integer `hits`**  
>>> MAG-7 hits  
>>
>>> **Integer `kills`**  
>>> MAG-7 kills  
>
>> **Object `m4a1`**  
>>   
>>> **Integer `shots`**  
>>> M4A4 & M4A1-S shots  
>>
>>> **Integer `hits`**  
>>> M4A4 & M4A1-S hits  
>>
>>> **Integer `kills`**  
>>> M4A4 & M4A1-S kills  
>
>> **Object `galil`**  
>>   
>>> **Integer `shots`**  
>>> Galil AR shots  
>>
>>> **Integer `hits`**  
>>> Galil AR hits  
>>
>>> **Integer `kills`**  
>>> Galil AR kills  
>
>> **Object `taser`**  
>>   
>>> **Integer `shots`**  
>>> Zeus x27 shots  
>>
>>> **Integer `hits`**  
>>> Zeus x27 hits (not tracked)  
>>
>>> **Integer `kills`**  
>>> Zeus x27 kills  
>
> **Object `map`**  
>   
>> **Object `italy`**  
>>   
>>> **Object `rounds`**  
>>>   
>>>> **Integer `won`**  
>>>> Rounds won on Italy  
>>>
>>>> **Integer `played`**  
>>>> Rounds played on Italy  
>
>> **Object `office`**  
>>   
>>> **Object `rounds`**  
>>>   
>>>> **Integer `won`**  
>>>> Rounds won on Office  
>>>
>>>> **Integer `played`**  
>>>> Rounds played on Office  
>
>> **Object `aztec`**  
>>   
>>> **Object `rounds`**  
>>>   
>>>> **Integer `won`**  
>>>> Rounds won on Aztec  
>>>
>>>> **Integer `played`**  
>>>> Rounds played on Aztec  
>
>> **Object `cobble`**  
>>   
>>> **Object `rounds`**  
>>>   
>>>> **Integer `won`**  
>>>> Rounds won on Cobblestone  
>>>
>>>> **Integer `played`**  
>>>> Rounds played on Cobblestone  
>
>> **Object `dust2`**  
>>   
>>> **Object `rounds`**  
>>>   
>>>> **Integer `won`**  
>>>> Rounds won on Dust 2  
>>>
>>>> **Integer `played`**  
>>>> Rounds played on Dust 2  
>
>> **Object `dust`**  
>>   
>>> **Object `rounds`**  
>>>   
>>>> **Integer `won`**  
>>>> Rounds won on Dust  
>>>
>>>> **Integer `played`**  
>>>> Rounds played on Dust  
>
>> **Object `inferno`**  
>>   
>>> **Object `rounds`**  
>>>   
>>>> **Integer `won`**  
>>>> Rounds won on Inferno  
>>>
>>>> **Integer `played`**  
>>>> Rounds played on Inferno  
>
>> **Object `nuke`**  
>>   
>>> **Object `rounds`**  
>>>   
>>>> **Integer `won`**  
>>>> Rounds won on Nuke  
>>>
>>>> **Integer `played`**  
>>>> Rounds played on Nuke  
>
>> **Object `piranesi`**  
>>   
>>> **Object `rounds`**  
>>>   
>>>> **Integer `won`**  
>>>> Rounds won on Piranesi  
>>>
>>>> **Integer `played`**  
>>>> Rounds played on Piranesi  
>
>> **Object `prodigy`**  
>>   
>>> **Object `rounds`**  
>>>   
>>>> **Integer `won`**  
>>>> Rounds won on Prodigy  
>>>
>>>> **Integer `played`**  
>>>> Rounds played on Prodigy  
>
>> **Object `tides`**  
>>   
>>> **Object `rounds`**  
>>>   
>>>> **Integer `won`**  
>>>> Rounds won on Tides  
>
>> **Object `train`**  
>>   
>>> **Object `matches`**  
>>>   
>>>> **Integer `won`**  
>>>> Matches won on Train  
>>>
>>
>>> **Object `rounds`**  
>>>   
>>>> **Integer `won`**  
>>>> Rounds won on Train  
>>>
>>>> **Integer `played`**  
>>>> Rounds played on Train  
>
>> **Object `assault`**  
>>   
>>> **Object `rounds`**  
>>>   
>>>> **Integer `won`**  
>>>> Rounds won on Assault  
>>>
>>>> **Integer `played`**  
>>>> Rounds played on Assault  
>
>> **Object `lake`**  
>>   
>>> **Object `matches`**  
>>>   
>>>> **Integer `won`**  
>>>> Matches won on Lake  
>>>
>>
>>> **Object `rounds`**  
>>>   
>>>> **Integer `won`**  
>>>> Rounds won on Lake  
>>>
>>>> **Integer `played`**  
>>>> Rounds played on Lake  
>
>> **Object `safehouse`**  
>>   
>>> **Object `matches`**  
>>>   
>>>> **Integer `won`**  
>>>> Matches won on Safehouse  
>>>
>>
>>> **Object `rounds`**  
>>>   
>>>> **Integer `won`**  
>>>> Rounds won on Safehouse  
>>>
>>>> **Integer `played`**  
>>>> Rounds played on Safehouse  
>
>> **Object `sugarcane`**  
>>   
>>> **Object `matches`**  
>>>   
>>>> **Integer `won`**  
>>>> Matches won on Sugarcane  
>>>
>>
>>> **Object `rounds`**  
>>>   
>>>> **Integer `won`**  
>>>> Rounds won on Sugarcane  
>>>
>>>> **Integer `played`**  
>>>> Rounds played on Sugarcane  
>
>> **Object `stmarc`**  
>>   
>>> **Object `matches`**  
>>>   
>>>> **Integer `won`**  
>>>> Matches won on St. Marc  
>>>
>>
>>> **Object `rounds`**  
>>>   
>>>> **Integer `won`**  
>>>> Rounds won on St. Marc  
>>>
>>>> **Integer `played`**  
>>>> Rounds played on St. Marc  
>
>> **Object `mill`**  
>>   
>>> **Object `rounds`**  
>>>   
>>>> **Integer `won`**  
>>>> Rounds won on Mill  
>
>> **Object `shacks`**  
>>   
>>> **Object `rounds`**  
>>>   
>>>> **Integer `won`**  
>>>> Rounds won on Shacks  
>
>> **Object `bank`**  
>>   
>>> **Object `matches`**  
>>>   
>>>> **Integer `won`**  
>>>> Matches won on Bank  
>>>
>>
>>> **Object `rounds`**  
>>>   
>>>> **Integer `won`**  
>>>> Rounds won on Bank  
>>>
>>>> **Integer `played`**  
>>>> Rounds played on Bank  
>
>> **Object `alleyway`**  
>>   
>>> **Object `rounds`**  
>>>   
>>>> **Integer `won`**  
>>>> Rounds won on Alleyway  
>
>> **Object `depot`**  
>>   
>>> **Object `matches`**  
>>>   
>>>> **Integer `won`**  
>>>> Matches won on Depot  
>>>
>>
>>> **Object `rounds`**  
>>>   
>>>> **Integer `won`**  
>>>> Rounds won on Depot  
>>>
>>>> **Integer `played`**  
>>>> Rounds played on Depot  
>
>> **Object `embassy`**  
>>   
>>> **Object `matches`**  
>>>   
>>>> **Integer `won`**  
>>>> Matches won on Embassy  
>>>
>>
>>> **Object `rounds`**  
>>>   
>>>> **Integer `won`**  
>>>> Rounds won on Embassy  
>>>
>>>> **Integer `played`**  
>>>> Rounds played on Embassy  
>
>> **Object `shortTrain`**  
>>   
>>> **Object `matches`**  
>>>   
>>>> **Integer `won`**  
>>>> Matches won on Short Train  
>>>
>>
>>> **Object `rounds`**  
>>>   
>>>> **Integer `won`**  
>>>> Rounds won on Short Train  
>>>
>>>> **Integer `played`**  
>>>> Rounds played on Short Train  
>
>> **Object `house`**  
>>   
>>> **Object `rounds`**  
>>>   
>>>> **Integer `won`**  
>>>> Rounds won on House  
>
>> **Object `vertigo`**  
>>   
>>> **Object `rounds`**  
>>>   
>>>> **Integer `won`**  
>>>> Rounds won on Vertigo  
>>>
>>>> **Integer `played`**  
>>>> Rounds played on Vertigo  
>
>> **Object `balkan`**  
>>   
>>> **Object `rounds`**  
>>>   
>>>> **Integer `won`**  
>>>> Rounds won on Balkan  
>>>
>>>> **Integer `played`**  
>>>> Rounds played on Balkan  
>
>> **Object `monastery`**  
>>   
>>> **Object `rounds`**  
>>>   
>>>> **Integer `won`**  
>>>> Rounds won on Monastery  
>>>
>>>> **Integer `played`**  
>>>> Rounds played on Monastery  
>
>> **Object `shoots`**  
>>   
>>> **Object `matches`**  
>>>   
>>>> **Integer `won`**  
>>>> Matches won on Shoots  
>>>
>>
>>> **Object `rounds`**  
>>>   
>>>> **Integer `won`**  
>>>> Rounds won on Shoots  
>>>
>>>> **Integer `played`**  
>>>> Rounds played on Shoots  
>
>> **Object `baggage`**  
>>   
>>> **Object `matches`**  
>>>   
>>>> **Integer `won`**  
>>>> Rounds won on Baggage  
>>>
>>
>>> **Object `rounds`**  
>>>   
>>>> **Integer `won`**  
>>>> Rounds won on Baggage  
>>>
>>>> **Integer `played`**  
>>>> Rounds played on Baggage  
>
>> **Object `militia`**  
>>   
>>> **Object `rounds`**  
>>>   
>>>> **Integer `won`**  
>>>> Rounds won on Militia  
>>>
>>>> **Integer `played`**  
>>>> Rounds played on Militia  
>
> **Object `last`**  
>   
>> **Integer `wins`**  
>> Last match rounds won  
>
>> **Integer `rounds`**  
>> Last match rounds played  
>
>> **Integer `winsT`**  
>> Last match Terrorist wins  
>
>> **Integer `winsCT`**  
>> Last match Counter-Terrorist wins  
>
>> **Integer `players`**  
>> Last match number of unique players  
>
>> **Integer `kills`**  
>> Last match kills  
>
>> **Integer `deaths`**  
>> Last match deaths  
>
>> **Integer `score`**  
>> Last match score  
>
>> **Integer `mvps`**  
>> Last match MVPs  
>
>> **Object `weapon`**  
>>   
>>> **Integer `id`**  
>>> Last match favorite weapon  
>>
>>> **Integer `shots`**  
>>> Last match favorite weapon shots  
>>
>>> **Integer `hits`**  
>>> Last match favorite weapon hits  
>>
>>> **Integer `kills`**  
>>> Last match favorite weapon kills  
>
>> **Integer `damage`**  
>> Last match damage dealt  
>
>> **Integer `spending`**  
>> Last match money spent  
>
>> **Integer `dominations`**  
>> Last match dominations  
>
>> **Integer `revenges`**  
>> Last match revenges  


## Example

```json
{
    "name": "ValveTestApp260",
    "count": 214,
    "stats": {
        "kills": 42959,
        "deaths": 33612,
        "time": 1780338,
        "bombs": {
            "planted": 1056,
            "defused": 295
        },
        "rounds": {
            "won": 17840,
            "pistol": 580,
            "played": 28765
        },
        "damage": 6068789,
        "money": 63585608,
        "rescues": 502,
        "knife": 612,
        "grenade": 141,
        "gun": {
            "glock": {
                "kills": 1110,
                "shots": 28008,
                "hits": 5590
            },
            "deagle": {
                "kills": 2714,
                "shots": 21090,
                "hits": 5930
            },
            "dualies": {
                "kills": 309,
                "shots": 5068,
                "hits": 1309
            },
            "fiveseven": {
                "kills": 884,
                "shots": 10505,
                "hits": 2929
            },
            "xm1014": {
                "kills": 456,
                "shots": 16518,
                "hits": 3427
            },
            "mac10": {
                "kills": 439,
                "shots": 12850,
                "hits": 2663
            },
            "ump45": {
                "kills": 1008,
                "shots": 20663,
                "hits": 4639
            },
            "p90": {
                "kills": 1251,
                "shots": 39499,
                "hits": 7401
            },
            "awp": {
                "kills": 4651,
                "shots": 13214,
                "hits": 5119
            },
            "ak47": {
                "kills": 8934,
                "shots": 145820,
                "hits": 29079
            },
            "aug": {
                "kills": 749,
                "shots": 10921,
                "hits": 2746
            },
            "famas": {
                "kills": 600,
                "shots": 12934,
                "hits": 2815
            },
            "g3sg1": {
                "kills": 387,
                "shots": 3338,
                "hits": 719
            },
            "m249": {
                "kills": 360,
                "shots": 10843,
                "hits": 1447
            },
            "p2000": {
                "kills": 2170,
                "shots": 35007,
                "hits": 8679
            },
            "p250": {
                "hits": 4538,
                "kills": 1150,
                "shots": 17763
            },
            "sg553": {
                "kills": 1585,
                "shots": 25719,
                "hits": 5248
            },
            "scar20": {
                "hits": 970,
                "kills": 539,
                "shots": 3626
            },
            "ssg08": {
                "shots": 4444,
                "hits": 1535,
                "kills": 852
            },
            "mp7": {
                "shots": 15532,
                "hits": 3700,
                "kills": 642
            },
            "mp9": {
                "kills": 298,
                "shots": 8060,
                "hits": 1915
            },
            "nova": {
                "hits": 4063,
                "kills": 577,
                "shots": 20228
            },
            "negev": {
                "hits": 5118,
                "kills": 1333,
                "shots": 63896
            },
            "sawedoff": {
                "shots": 8072,
                "hits": 1571,
                "kills": 259
            },
            "bizon": {
                "shots": 13350,
                "hits": 3108,
                "kills": 467
            },
            "tec9": {
                "kills": 737,
                "shots": 12279,
                "hits": 2683
            },
            "mag7": {
                "shots": 12682,
                "hits": 3013,
                "kills": 448
            },
            "m4a1": {
                "kills": 6491,
                "shots": 110824,
                "hits": 25856
            },
            "galil": {
                "kills": 504,
                "shots": 10343,
                "hits": 2090
            },
            "taser": {
                "kills": 86,
                "shots": 227
            }
        },
        "headshots": 17482,
        "backfire": 1662,
        "map": {
            "italy": {
                "rounds": {
                    "won": 256,
                    "played": 287
                }
            },
            "office": {
                "rounds": {
                    "won": 216,
                    "played": 399
                }
            },
            "aztec": {
                "rounds": {
                    "won": 158,
                    "played": 165
                }
            },
            "cobble": {
                "rounds": {
                    "won": 182,
                    "played": 355
                }
            },
            "dust2": {
                "rounds": {
                    "won": 3039,
                    "played": 7291
                }
            },
            "dust": {
                "rounds": {
                    "won": 133,
                    "played": 151
                }
            },
            "inferno": {
                "rounds": {
                    "won": 482,
                    "played": 985
                }
            },
            "nuke": {
                "rounds": {
                    "won": 197,
                    "played": 271
                }
            },
            "train": {
                "rounds": {
                    "won": 191,
                    "played": 319
                },
                "matches": {
                    "won": 7
                }
            },
            "assault": {
                "rounds": {
                    "played": 4
                }
            },
            "lake": {
                "rounds": {
                    "played": 104,
                    "won": 44
                },
                "matches": {
                    "won": 12
                }
            },
            "safehouse": {
                "rounds": {
                    "played": 65,
                    "won": 37
                },
                "matches": {
                    "won": 11
                }
            },
            "sugarcane": {
                "rounds": {
                    "played": 35,
                    "won": 33
                },
                "matches": {
                    "won": 3
                }
            },
            "stmarc": {
                "rounds": {
                    "played": 98,
                    "won": 44
                },
                "matches": {
                    "won": 8
                }
            },
            "bank": {
                "rounds": {
                    "played": 8,
                    "won": 8
                },
                "matches": {
                    "won": 5
                }
            },
            "shortTrain": {
                "rounds": {
                    "played": 293,
                    "won": 235
                },
                "matches": {
                    "won": 89
                }
            },
            "house": {
                "rounds": {
                    "won": 5
                }
            },
            "vertigo": {
                "rounds": {
                    "won": 6,
                    "played": 9
                }
            },
            "monastery": {
                "rounds": {
                    "won": 2,
                    "played": 5
                }
            },
            "shoots": {
                "rounds": {
                    "played": 48,
                    "won": 35
                },
                "matches": {
                    "won": 14
                }
            },
            "baggage": {
                "rounds": {
                    "played": 10,
                    "won": 7
                },
                "matches": {
                    "won": 7
                }
            }
        },
        "donated": 1370,
        "windows": 121,
        "flashKill": 524,
        "knifeFight": 177,
        "snipers": 2953,
        "dominations": 1284,
        "brutality": 1591,
        "revenges": 435,
        "hits": 148302,
        "shots": 713446,
        "last": {
            "winsT": 9,
            "winsCT": 12,
            "wins": 16,
            "players": 10,
            "kills": 29,
            "deaths": 13,
            "mvps": 5,
            "weapon": {
                "id": 7,
                "shots": 118,
                "hits": 34,
                "kills": 12
            },
            "damage": 3735,
            "spending": 43050,
            "dominations": 0,
            "revenges": 0,
            "score": 55,
            "rounds": 21
        },
        "mvps": 4136,
        "demolition": {
            "bombs": {
                "planted": 40,
                "defused": 15
            },
            "won": 4147
        },
        "gungame": {
            "rounds": {
                "won": 6058,
                "played": 6682
            },
            "matches": {
                "won": 4179,
                "played": 5127
            },
            "won": 42,
            "score": 3379,
            "lastScore": 0
        },
        "matches": {
            "won": 4715,
            "played": 6068
        },
        "score": 292742,
        "burns": 215,
        "unknown": {
            "GI.lesson.csgo_instr_explain_buymenu": 16,
            "GI.lesson.csgo_instr_explain_buyarmor": 0,
            "GI.lesson.csgo_instr_explain_plant_bomb": 0,
            "GI.lesson.csgo_instr_explain_bomb_carrier": 1,
            "GI.lesson.bomb_sites_A": 0,
            "GI.lesson.defuse_planted_bomb": 0,
            "GI.lesson.csgo_instr_explain_follow_bomber": 0,
            "GI.lesson.csgo_instr_explain_pickup_bomb": 0,
            "GI.lesson.csgo_instr_explain_prevent_bomb_pickup": 0,
            "GI.lesson.Csgo_cycle_weapons_kb": 16,
            "GI.lesson.csgo_instr_explain_zoom": 16,
            "GI.lesson.csgo_instr_explain_reload": 16,
            "GI.lesson.tr_explain_plant_bomb": 0,
            "GI.lesson.bomb_sites_B": 0,
            "GI.lesson.version_number": 16,
            "GI.lesson.find_planted_bomb": 1,
            "GI.lesson.csgo_hostage_lead_to_hrz": 0,
            "GI.lesson.csgo_instr_rescue_zone": 0,
            "GI.lesson.csgo_instr_explain_inspect": 32
        }
    }
}
```

