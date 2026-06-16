import { useState, useEffect, useRef } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, Legend
} from "recharts";

// ─── Config ───────────────────────────────────────────────────────────────────
const API = "";

const BADGE_SRC = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/4QK+RXhpZgAATU0AKgAAAAgAAodpAAQAAAABAAABMuocAAcAAAEMAAAAJgAAAAAc6gAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAaQAAAHAAAABDAyMzGQAwACAAAAFAAAAoyQBAACAAAAFAAAAqCSkQACAAAAAzAwAACSkgACAAAAAzAwAADqHAAHAAABDAAAAYAAAAAAHOoAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADIwMjU6MDg6MjcgMDM6NDM6NDYAMjAyNTowODoyNyAwMzo0Mzo0NgAAAP/hApxodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvADw/eHBhY2tldCBiZWdpbj0n77u/JyBpZD0nVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkJz8+DQo8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIj48cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPjxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSJ1dWlkOmZhZjViZGQ1LWJhM2QtMTFkYS1hZDMxLWQzM2Q3NTE4MmYxYiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIj48eG1wOkNyZWF0ZURhdGU+MjAyNS0wOC0yN1QwMzo0Mzo0NjwveG1wOkNyZWF0ZURhdGU+PC9yZGY6RGVzY3JpcHRpb24+PC9yZGY6UkRGPjwveDp4bXBtZXRhPg0KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDw/eHBhY2tldCBlbmQ9J3cnPz7/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCACeALMDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD9U6KKKAGs23tSeZ7Ukn3qbQA/zPajzPamUUAP8z2o8z2plIW20rgSeZ7Unmc9K5H4gfFPw18MNNjvfEepLYQyErGNpZnI9AOTXC+Ov2jdL0fwToPijw+ia5pWpX8dk0yts8oMcEkHuPSuynhK9bl5I7uy7HDWx1DDqXPLVK57M1xt/h/WgXGe36185Q/HvX7zT/ipDss4b/w2u+xeMZV0K5Bb1rjvhn+0p4o8Y618OLWe4gU6nPPBqkaxAbinKkHtmu+OT4qUZSSXu7/df8jyp59hIuC/m/zsfX/ne1L5or5z039pq4sLP4j6vrNrC+leHb8WVmtsMPO56KSeprqvgz8fF+Jmsalouo6LcaDrdjElxJazkMDG/wB0giuWpl+JpxlKUdF/wP8AM66eaYapKMFLWX9foex+Z7UeZ7VlaX4j0vWJZ4bG+gu5LdzHKkMgYow6ggVf8za1cMouLs1Y9WMlJXTuTeZ7UeZ7VGrbqWpLH+Z7UeZ7UyigCaiiigAooooAKKKKAI5PvU2nSfeptABRR+lYXjDxppHgPRJdW1u9SysYsBpW55PQAdzTjFyfLHVkTnGnFyk7In8TeKdM8H6Tc6nq13FZWVum95JXCj6c96+a/jd8eNY1Tw14X1Lwpqf9h+F9dna2n1uSEiW2IbGcHoMd69l+I3w28O/HLwzZx6k00tkf38DROUzuX5SR36ivnPw/pE+reF/FfwL8VAjVLJGn0K6k5NxGOUx6kdD9a+iy2jh7e1nrKL1T7baenU+RzbE4ly9lT0hJaNd/+CO+L/iDTNS8P/DzxjY6s/inS/D2pf2XqNxcRcTbgqs5HfP5c0nxSfwe3wu8deCvC9hPYPoJi1eSRiSshdgSU79Diul+E/gXxx478JweF/GmgWWi+DUtDaz2oUJcXEg4EqlfunjNeufDL4E+FvhjY3sFjbSX816ALm4v3855FHRCW/hHpXbVxdHCWXM3KDurbb9el9zgpYGvjbztZTVnf06fgfK/hHwmNBu/F9jotveXdhrnhEXkbsrSEzEZI3dzntSeCfhzr3hr4lfDHVBpt4NOns1uLkrAQIJQhBDeh6V92WtnbW8SxxwRxRou1VVQAq+g9vavy/8Ajd8VvF2jftI6ppFl4g1GDT21VEFuk5CIpYDAHYVVPPpzUk42UrJ9b3Vjto8J1K01Gi7uCcu2i1Z3t0lxD8Nx/aEbWena142eS7muEK+XGrfKWyOM4r1jVfjj4W0vwZ4s8Y6Fo62esSTDRLPUZGGL5h8ocf7K+vtX0j/wjum+IPDNvZanYW99aTQoZIZowysSvJI9a5LxJ+z34N8TT6TJLpaRRaUri2s4ztt8sMZKDgn3rGOaYetKKxMGlF9Oq0/yRlLJcTRjKWHmnddT5z/ZlubH4czfEfxbfXpuodPgQT3e/KyzEFnxzg5bivpH4CeMvEXxB8A2mveI7OGzmvHaS3SHIzDk7SQehr5f+JPwl1r4S+FbDw9dW8154SvdZN/q+oafGWCxbgEi29cAc+lfYdrr+j+HPAsGq+Ytno1vZrMjSLsCRBQQCD04pZv7OtatTXM6j08kla3qxZNKtRcqVfRQV3fq31+R1a4x3FLXzd8Of2gNS1qTxB438SXcOi/D5pFtNKSZP3sjA4Lg9SCa+htPvodStIbm2lWa3mUOkinIZSMgj8K+er4arhpctRH1eFxlLFK8GWqKKK5TuJqKKKACiiigAooooAjk+9TadJndTP4vSgCC+voLC1luLiVYYY1LO7nAUAZya+TvjNrmlfH6G31PwJri6pq3hqbz20GbiO6C8thD948cGvYfjauk+PtEv/AsfieLRddu4VlWHzAHdM/dI7g9K+P/ABNa/wDCHSCx8URN4G8c6RFnS/EGmxEWmoInCo4XqT0/nX1WT4ZNqrf3+it07+a9D4fPMZO/sLe538/0Pa/gz+0oraMbvxXqP2jV9S1NbK28P2MH72yGcYK9SPevoW98A6Fq3ijT/ElzYRyazYoUt7lh8yKTyK8y+CPwv0nWbbSPiNrGhR2ni+9tFM20AIG/56BezMOv1r25Vx2xxXm5jUp/WJfV1y9+3y8j2MqoVfq0VibNdO/fUlZMg44rl/iL4obwL4J1nXlt/tb2Fs84hJxv2jOK6pTxWH4z8M2/jPw5qOh3pZLS+gaGVozhgD6V5MLKSvse5O/I+Xc+I5P+CmyoCh8IqGU4IExr5J+IfxMt/G3xbn8XLb/ZYri7W6aBjkIQQdo/Kv0Dm/4J3fDKGEu02ojaOS0q8/mK+EPix4B0vwn8drnwrYo76VBepbozkHchIySenenio1ZJewlH4l0f+Z+hcM1MmVapGpSqc3sp3blG1ra9D6YtP+CmkdnZwQjwuGMSKhPm9cDHavq79nz4vP8AG74eweJ2sf7NWaVoxBu3H5cc/jXj2m/8E9/hnc6fbTub4mSNWJWUbckZ9K96+Efwp0r4O+EIvDmjPM9jHI0i+c25gTXRPl5LStfyTPhcZLBVJxeBpzgtb88k1+COzkhjuISksayIwwVYZBrxf9pP4c6l440TT1bU3sfCens1zq9nbRs0tzEoyEXHXp0r26NcLg9KZcRCWNlYBlPUHpUYevLD1Y1IvY87E4WGIpSpvqfnB8TNffxe+hXuuRNoHhBWCaToMYKubVOsrL/ebGB9a+sf2dtc8SyaC194p+yaJpV8VXRNJYhJIIQMAHPUkc1x37Qvw10Xwfr0nxS1COTWnskjt7HRJfltkmJAVmI/hHXFea/EK11j42fELXnsree7vdE0aB7OwsbgqsNy20kqQcEg/oK+5qyp5nhIQglGKu2+z7evmfnlJVMrxU3J803oo913Pu0MG70tcB8JvEh1Lw5baVeapDqGv6VFHb6msb7mjm2jIJrv/SvgqlN0punLofpNCsq9NVF1JqKKKzNwooooAKKKKAI5PrioJptqnaN5qeTr+FeTftLa1rGg/CHXJtDiuZdRZVjQ2YJlQEjLDHPArWjTdarGmursc2Jq+xpSqdj5Q+P3i/V9X8aXdt4w8HQaHeRzGPTtaV3hcRg/JmUZB69/Wu9+CPhfxx4yvrTSPHOnWXijwZGv2i31S6lSZ42XBXYynP51HoP7R3h3xZfJ4e8Rx2zeGrHRv3/9uw/6RPeKBkAn19eteu/sr+HNL0/wC2taXpU2ix6xK1wLGScyJGMkApnoCOcV9xjMRUwuC9nKjytdf8n3PzrB4enjcfzqrzRd3b06M9ptYFhgVEAVQMAL0AxgVJt20Q5VTSySLDG0jttRRuZieAByTXwN7u5+mpWViG+1C20u0mubyeO2tYUMks8zBERR1JY8AV+fH7QX/BU6GDxPJ4J+CGgv448S7mh/tDy2eAuOD5Ma5aQj14Feefti/tRSftF33jTw5oXiaPw58KPBsLHVbyOcLc67dYIWCFf4l3cfgTXzX4d1j4d/CH4N+AvEHgS+utY+OOm6out3babbySR29sc5t5HxjAXqfUmmM3PHHxd+N2pW95rnxwuviNomkTExWyaUn2CDeR8q4I5FVfDcctxfeGBqLXMckkKmZ7ot54Vm+85PO7B619qfA/4L+L/20tS8P/GP406vbXXhWMi68P8Ag3TZM2qkH/WTHPJyPumvBv2gLeNv2otYhaMC2bUkh8tOFCcAqB2GKv8A5dpf3o/me9kXvYmsv+nVT8j33Rf2R/ij4a0SDxJ8EPj/AKhfwuqzJpmszC7tXzyU3AkDHToK2PBP7f2s/Cnx9b/Dn9o3w/D4N8QTKrQa9aOHsrhCcB2x90EjrXJ/EH9nrxb+xlo9z8V/gt4x+y+HLaJbvWPB2vXG60lQgFvLY9G9B15rF/Y10Hwt+3R4x+KPxJ+JKWOq6lqaJpVv4Ykbe2mWYA+dc8gk9GHQ0pv3mfPR+FH6Q6bqVprFhb3tjcR3dpcIJIpoW3I6noQR1FWT+lfn74R17xL/AME7/ivYeDfE+pXWu/AvxNc+Vo2sXJLvo1wxwIpD/c6e3evv6GZLiNJInEkcih1cHggjIIrMoyvFPhfTvF2h3mk6pbC6sbtCksTHqP8AGvlctffDXxFrHgP4PeErr+12cC913U8tHHxwQx+8ADX2Btrxz47aH42vxZr4W8QWPhjS5Aw1K+mA8wehBPtXs5dWUZ+xl8L73tfu7bnz+aUFKP1iKfMuy1t/XU4f4S/C3VPhB8STrviXxxY3d1rse2/tZcRyS3BI2bOeQM46V9OV8F+Iofhp8LYzrV94ob4h+N7dllhWedjErhgc/LwMdfwr7Z8H+IIvE3hnTdUhx5V1AkoA5AyBxXVm9KfNGtJt30va33I58lrQjzYdK1tbXv8AidDRRRXzx9SFFFFABRRRQBHJ96vAf2ota8XafJ4Rg8HQXE+oSagXeOEEJIoX7sjdACfWvfpPvV4f+0P4g8SaL/ZZ0DxZo/hncZPMGq4Hmem0mvQwF/rMLJP12PHza31SV216bnjXiT4hQeIHFj8SPgrdJLIwQ31jEHLEnGdwGa+t/B+m2WkeG9OstNtja2EUCLDC4wUXAwD718m6d8bviL4S1jR5tX8ReGPFWmXV3FayWti6mb5225GPTOfwr7Jjy8aNjbxnFelmylBQhay8pNr7nseRkso1pzmnqu6Sf3rckUYFfLP/AAUB+LmreDvhhpvgjwlIy+NPHl8uiWGw/PEj4Esn4KcfjX1Mucda+JrrHxb/AOCnEVvctv0z4d+HvOijLjb9qm749cH9K+dPrz55+Of7EPw58BfED4D/AAx0XTZrjxH4gvFl13UXnZzJbxKDKSp4AYlulfeeneFfg58JdPu/DWk6DpOnebbNbz21hZiSaSNgV2uVBPIPcivmD9oTxzb6D/wUAstVnctN4f8ABsjWMec5uZiygj35H5U7xl4l1P4E/stz61BeSQeMPGF9+6uGyZkjyTkEnPf9a7fYwpYSWNrfCnZLuYYVV8zzSllWE+Oe77I7n9jzwh8Q/gbb+OfB8Ph+fVfBY1SS88NXd1KINsLnLIyt8ygHp+Nc742/Zik8dfFa81a5ttQt/FM1wuoCyjKm1WPPUS/gQR1rxuD4yeLba68Fw6J8RPER1++lj+2JrK+VaJnqAWGCMnH4V7X+1nZeN/A66r410nx/qVs6WMEx0+FQIlVmCnDdeSCfxrgw+bqEJyhRTS3/ADR9pW4LxFLF0aU8XyOreKdmr9GvmL8bvhT8QvjV8StA0v4kRS6F8F9KWOeTTtHJuJNSmTGFnKDhePpWF+0t4V0r4T+ItL+OfwUltbLW/DUSRa94dt1MKajp64U/u+Mso9s12vwo0H4g6x+z3q/jBPiRqmq32qaQ09nBIihradRn5GA56Ec+tcJo2qXX7SP7LM2oatKbzxd4ZuGhvZnAEksTAg5wBkEfyNbYXEUcbXhTmuVz+48LNMlxWV4aviaVVVI0WotWaZ9M+MtP8FfthfsvXEkkkUnh7XtL+1w3Eh+azlVd27PZkYdfavMf+CaPx9k+LHwfuvC2paiup674NuDpr3ne5twSIZDz6DH4CviD4V/E/wAfWHgnxH+zL4WtLqTU/E2qiOwvlB22NjL/AMfBz24/nX038LPhjpn7H/7cXgzwvoyfZ9C8XeFPsUuG/wBdeQDLSEepPNVXovD1HTlunY8ijVhWpxqQ2aufoMuR1rzn45eF/DHijwHer4tkli0W123MrxOVI2nOOOuelejtXJ/EnwjZ+OfBWr6HfzeRa3lu0by5xs9GJ9jzRQlyVoSbtqZYyLlQnZXdtj5L0nx38PLXS7iw8J/BrVNahmiaH7TJakl1YYzuYZ/KvqH4K3Ek3w60lZPD8vhfykMa6XM25olB4GevSvn+z+B/ia4s47O8+NiQ6fAqoiae6KQi8AdeuK9k/Z5j0ey8H3ljo3iK98TxWt9JHPeXxy4k7gH0r6XNHSqUb023Z/3n+L0PkcndWOJtUXLo9Pd/Q9hooor5Q+6CiiigAooooAjk+9Xg/wC01feB7O00ZPF/hebxPPPMyWVvbIWk3Yy2Me1e8Sferyf44/Bu9+Kx0WSw16Xw/c6bK8i3Fum5zuXBHXjiu/AzhTxEZVJNJdUeXmUKs8NKNGN5eZ8x+HfFXgjRfFVhr2ifCmS30CC6itjq90+14ZicfcJ6qWweK+7beVZoUdTlWUMPoRXzPpv7D2jRsral4n1nUP3onZPNCRmTOSdo96+lLGEWdpDbqSREgQE+wx/Su7NsRhq8oOhJya73/U8rJMPisPz+3jZOxa/iFfmNoP7Ndn+03+2V8e5tR8WeIPDN1o93bLFLotwIWlQqRhj3AwK/Tb3HWvhPwr4gb4P/ALd/x2tWiZhrnhuHWrOKNcmZ4xghR3PJ/I14kIuTsj6Wc+SLkzyvS/2VdJ8C/tI3WkaT4h1TxbIY4YJr7V5PNnjdjygbPQLzXov7ZXwh+Jfj3xp4dsPDXhiS98M+HraNbeYyqqO/BfIJ6cAVwfhb4nXnhLUL7xBrQ1fStSvLp5/tFtAFLM/8JaQYGBwMV0+ufHHVNUXL+GvEGuIRkf2xPL5R/wC2aAZr7vMsgqY6jSwtOSUIpdVvufIcOcYf2DjquZOnz1Hok07JbHH+KPAnxM+O2v8Ah/S/G0/hrwtpunSKuYriJSFyA3Qn5sDj8K+mf2mvBF54z8B6toGhouo3P9gW6w/vFCShJRyWJwOBXz3a/GbxvO5ji8IaathjDWY0UlWXvliN341tal8RPDqeHX1+LU/IuFtfKHg2aRjElyH5bnrF/EF6V5MOE3hrx52+fS+j/wCGPcxXiZWx1ejV9ioqi+aMUmle9+u9z3P9kHVbXwp8EdN8LeKdT0+y1e2eVDaSXKMdjHjv7155+z78D/GXw0+N3jewn0iSf4feIvNRL1ZVaNASWQ4B98V4zZ/FLxzeLFcf2Tb39k4DIg0kGFl7bWAzj3Fdr4f+Nes6SrCPw74g0RzyW0eWUxk/9cpAVFbVOEJUfZypVLuG2qOan4izrSxcatHTEbqzstb6Gn8HfAf/AAr39srSdRcCIz2l1p8zyYw3GQAf7xwD9K639sTFn+15+zBeQjbM+q3FuzdyhXJH+fWvH/FnxS1HXPEljcwR6hceI4J478C4tvKnTbwSqr1VhwT2qRPjYn7V3/BQH4YaZpETHR/BdrLdTM38NyY8yk/QgL+FGfYOVOVOu7Xa19Uebw9jVVdTDpNKLuvRn6XKCQfTNcl8VL/StL+H2u3Ou+YdIS2b7SIjhthGDg+tdcrde1cf8VvAo+JHgfUvDj3T2iXiqrSoMnAYEj8cV8vRcVVjzbXPqcUm6MlFa2PkDw94a/Zq15RHHrGpabK/RLy6kjPP6V9GfszeAbLwD4JvbXTtYt9asbi+kuILi3ORsPAUnuR3rB8Tfst6TrHiCLVBaWc9tb6M1jFp7QBFefbhZWI78Cu2/Z9+Hdz8L/hdpmh30ccV9G0kkyQncoZmJ4PfjFfR5hi6NbDWo1ZO9tHqfKZXhMRRxSdamkknqtD1Kiiivlz7QKKKKACiiigCOT71Np0n3qbQAUm0UtFKwhDXwz/wUCXVvgj4/wDh5+0RoVg2pHw7K+l6xZodvn2sv3Qx7DORk9CRX3PXLfEz4eaN8VPA+s+E9ft/tWkatbtbXEZHQEcMPcHBH0pjPzv+OP7UPin9pT4M6p4XH7OXi2I6rAs1jqVqcpFIPmjlVgoyAeap/AX9sT9oLxv4fj+H3hf4U6Zq/jDwvAlnqt7rEwhdSBtVnjJBzgDNeu/spfGTVf2ePiBN+zn8VbtoZbNseE9euWIj1G2LHbFuPG4DGBXWftVfs0+KYPGlp8bfg1Mlj8SNLjxf6euEj1qAdY3HQvjIBrT2k0rXMXSh/Kjjf+Gd/wBqz4yIy+OPifo3gPS5OJNP8MWwaXaeq7//AK9eh+BP+CdXw28G6BqVpey6p4o1bULWS2k1LV7osYy6kbkQcKQTnNdD+zV+2l4R+PVt/ZF2f+EV8e2Y8vUfDepHypllHDGPdjeuf519FNkr/OiNapFWUmT7ClLeK+4+L/8Agn34qvPD9r4u+B3ivY/iPwHdtHaeeAZJ7BmPlvz1xwPxr7DGn2u3BtocZ5/djp+VfBH7bPjLQv2b/wBo74d/GzS9YsTdsx0bxFpFvcIbi6tG5EmwHnaPX0Fea/tQ/tzfFn4p/DDVNX+HHh698CfDyWRbOLX9TXy73VWk4WK2X3HPGeO9TzS7l+yh/KjjviV8bfFHjz9s74p2fwzs1uNWmsv+EdtdWkYfZtItYwftN0T90EYOGNetf8EmfgfBpOtePfiMGe+tJJ20fTNRlyTdqrZmmBPYsK8y8F+Cbq18GaF+zv8ADeNZfiZ4rjW8+IfimEbzp1tIQzQNJz82DyAfWv1E+FPw30f4Q+AND8I6FCINO0u2WBNq4LkDlz7k5JolOcrJu9iowjH4VY60ClxRRUlhRRRSsBNRRRTAKKKKACiiigCOT71Np0n3qbQAUUgYetfPXxa+OvxF0b40RfD/AOHvgzSvEtyukDVrifVdQa2CKXKBVAU55FAH0NQRmvmn/hZn7S46/CnwiP8AuPP/APEUn/Czv2lgMn4U+Ecf9h5//iKVx2Z3X7R/7M3hb9pTwW2ja8j2moW7edp2sW3y3NjMOQyN6Zxkd6+KfHH7S37Tf7E+nroPjDwxZ/ETw7a/JZeKlEm6SEfdEpXOCB6jPvX07/wsz9pf/olPhH/wfP8A/E1FfeOf2jNWs57W8+EHg28t5F2vDNrbMrZ4IIKUwsz8/fGHinxr+33Haav4f8F+CPC/iKGZTHrtvra2moIc9WBYEj6+or0Lxj8Cf20rH4dWOmW/xRt9atYlKtaafqscd0FI6GVsFvzrtPiB+xv4g+IVxNezfs8eEND1KUsWvNE8TSWrE+uFXFcKv/BPT4mNIoXw9ei1UZEK+NpCPz20CseKS+Ivhl8G9H1XQvi18Htc1HxtqVnLCddvNaS7kjkI+WSPnC4PNS/C3wL8fv20dO8AeGtOSfSvBfg5fKstau4jDDGMnbIc8SSBeBgV9QeA/wBjvxL8PruK6T4AeFdd1BGEi3Ou+J5LpsjnOGXFfROmeOv2itHsY7K0+D/gyzs4lxFBDrhjRF9AoTFA7M7v9m39mHwx+zV4PfStF3ajrF4xm1PXLrBub2U8ks3pnOBXsKpg5r5tPxI/aV/6JN4Sx/2H3/8AiKb/AMLK/aT3Ef8ACqPCIP8AteIH/wDiPagD6Wor5s/4WJ+0yenwn8Hn/uYX/wDiaXwh8dvita/GTwr4M+IHgHQ9AtfEEVy8F7pmqtcsGhQMQVIHXNAj6SopNw654o3D1oAnooooAKKKKACiiigCOT71ZfiXTb3V9A1Cy07UG0q+nhZIL1F3GF8fK2O+DWpJ96m89qAPhv4M6Z8bfiJrPibw1rnxxvPD3jTw5dtFfaV/ZELh7cn9zcRknlHHfseKih0Hxn8M/j/45/t7xheeO9cPgYNZXS2axSx5uCAiqme5zmvQtd2/FL9sjQpfBai0l8D2rxeKtei+5cLIMx6cR0dgfnOeV49ap/tVfCn4y2XxAh+J/wAF9T006pHpP9l3+kXluryTwrJvzFu43cng4pPVWNqVT2U4ztez2PNtHuvFniGfQ9ONx4ktNfis0sg8yybCoZvNeX+HJXGD1zVpfFXj2K70HU7u11xN0s73kcUTskSBTAm4e/3hjJ5zT/hb41+KvxTuLmx03446Xo3ie0QtdeG9Z8LrbX0LAEsNjH5gDxlc1t/BGH9ov4xfD+PxEvxc0XS2a7ubMwr4eRs+TKybuvGdpP415n1J9Zs+v/1ihf8A3eNjD8L33jC3axs/F02sf2FBeQxXM8QlEkiFCYSSoyBkjOPTmuw0O48Qf8KP8W6jZ3GoTa/p+tPOIwZjMyrJhV+bqNp6Diurb4SftEyLhvjXohPHP/CNIen/AAKmJ8IP2iYVIT426MATkj/hGk5/WtFhWl8bOWvnkazTVFR2220f6nmOn6Z421KNodVn1op/pNl8ryJvVLcuHyPViMHvitzwFa+MdO+I3hi0Sa/bwwJbTzVnaVpi5t8n5jxtz1z3rtW+E/7RXOPjZooHoPDSf/FUi/CP9olTkfGvRc/9i2n/AMVUxwrX2mVWz/2iklRSumtDzzWdD1nSfHwe2m1QpL4mnSMXU8zRH90DGOCcLuPHb1rNuLnxXJounyaDc6o+sPFdNryagsxKz70yseOM4ztxxXqv/Cov2iOP+L1aGcHP/Isp/wDFUn/Cn/2hyxY/GrQySc/8iynH61Twre0mVHiFx5V7Jaen9eZ47HfeO7abULfUp9dXQfmlmuY/MMi25mAZBjnIHIxzg1qWviXxH/Yup6bqV3rQtZ7a1kQ7JWlNgJW3kMOfM2bc98V6ePhH+0SFx/wuzRSOmP8AhG0/+Krlfin4U/aH+Hfw88QeKT8YNFvv7HspLv7L/wAI6i+aFGduc8ZqVhJfzmk+IKdR80sOr/15HH6bJ4p1LWNIsLuPW2jl+XS2W4ljItssDJIR1YDZ8rdQara94f8AG+teN/gVBpviiXRPGNx/as76rf2nn7QFClTEx6FRWr4l8VfFT4e+BdE8SeK/j54d0c6naQ3MFj/wjqSXUzugYRRxA7mJzjOMcVN+zj4I+OnxS+MOhfET4k30cPhHQY7lNHgudPWzvroTIF8x41+4OBwa2pYd05X5rnm4/Nvr1P2fs1Es/G5vjp8GPCI1KX4zWWp6teTrYaPo8GgIJb66c4SNfm49SegFfUXwl0/xXpnw70SLxxqkWreKfs6tf3MMIiQyEZKqo6AdM968M+KaDwL+2B4M8X+NUa+8HahZ/wBk6HdvxDoupMeTIOmZhgB+2MV9Q53c5BB5BFdh88W6KKKACiiigAooooAjk+9Wb4jtL/UNBv7bS71dO1CWFkgu2TcIXI4bHtWlJ96m0AfJPw6/ZV+Mnwt0SbSvD3xksYYbi6kvbiabQo5JriaRtzvI5OWP19K6tvhB+0G2P+L3aeP+5fj/AMa+i6KAPjT4l/sV/Ez4uJbt4j+K2mnUbZ99tq9hoKW97Af9mZCGA9q9+/Zy+DMvwJ+FGmeDrjWH1+a0kmlfUJE2NM0jlySPXJr02loAbtHpS7RRRQAm0elG0elLRQAm0elG0elLRQAm0elcr8VvA5+JHw38SeFkuPsTatZSWguiu4RFhjdjviurooA+G/hz+wn8Uvhnqn9rW/xL0PxBrkYWKDVtf0drqe3iUBVjj3OQqgelet/8K1/aPPT4t+GgP+xfP/xdfRNFAHyl8RP2d/jr8UPB+oeGvEHxQ8M3umXq7XUaCVdGHKuhDcMDyDXvvwp8N694P+Huh6H4m1pPEWt2FssE+qxxGIXJH8RUk4OMd67GkxzQBNRRRQAUUUUAf//Z";

// ─── API Helper ───────────────────────────────────────────────────────────────
async function api(path, options = {}) {
  const res = await fetch(`${API}/${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
}

// ─── Colors ───────────────────────────────────────────────────────────────────
const G = {
  bg: "#0a0e1a", surface: "#111827", card: "#1a2235", border: "#1e2d45",
  accent: "#f5a623", accentDim: "#c47d10", green: "#10b981",
  red: "#ef4444", text: "#e8eaf0", muted: "#6b7280",
};
const CHART_COLORS = ["#f5a623","#10b981","#3b82f6","#a855f7","#ef4444","#06b6d4","#f97316","#84cc16"];

// ─── CSS ──────────────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@100..900&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  body{background:${G.bg};color:${G.text};font-family:'DM Sans',sans-serif;min-height:100vh;}
  ::-webkit-scrollbar{width:4px;}::-webkit-scrollbar-track{background:${G.surface};}::-webkit-scrollbar-thumb{background:${G.border};border-radius:2px;}
  .app{min-height:100vh;display:flex;flex-direction:column;}

  .header{background:${G.surface};border-bottom:1px solid ${G.border};padding:0 1.5rem;display:flex;align-items:center;justify-content:space-between;height:64px;position:sticky;top:0;z-index:100;}
  .header-logo{display:flex;align-items:center;gap:.75rem;}
  .logo-icon{width:40px;height:40px;border-radius:8px;overflow:hidden;display:flex;align-items:center;justify-content:center;background:#fff;padding:2px;}
  .logo-icon img{width:100%;height:100%;object-fit:contain;}
  .logo-text{font-family:'Syne',sans-serif;font-weight:700;font-size:1rem;}
  .logo-sub{font-size:.65rem;color:${G.muted};display:block;line-height:1;}
  .header-right{display:flex;align-items:center;gap:.75rem;}
  .election-badge{background:rgba(16,185,129,.15);color:${G.green};border:1px solid rgba(16,185,129,.3);border-radius:20px;padding:.25rem .75rem;font-size:.7rem;font-weight:500;display:flex;align-items:center;gap:.4rem;}
  .election-badge.closed{background:rgba(239,68,68,.1);color:${G.red};border-color:rgba(239,68,68,.3);}
  .dot{width:6px;height:6px;border-radius:50%;background:currentColor;animation:pulse 2s infinite;}
  @keyframes pulse{0%,100%{opacity:1;}50%{opacity:.4;}}

  .btn{border:none;cursor:pointer;border-radius:8px;font-family:'DM Sans',sans-serif;font-weight:500;transition:all .2s;display:inline-flex;align-items:center;gap:.5rem;white-space:nowrap;}
  .btn-primary{background:${G.accent};color:#0a0e1a;padding:.6rem 1.25rem;font-size:.85rem;}
  .btn-primary:hover{background:${G.accentDim};}
  .btn-primary:disabled{opacity:.4;cursor:not-allowed;}
  .btn-danger{background:rgba(239,68,68,.15);color:${G.red};border:1px solid rgba(239,68,68,.3);padding:.55rem 1.1rem;font-size:.82rem;}
  .btn-danger:hover{background:rgba(239,68,68,.25);}
  .btn-ghost{background:transparent;color:${G.muted};border:1px solid ${G.border};padding:.55rem 1.1rem;font-size:.82rem;}
  .btn-ghost:hover{background:${G.card};color:${G.text};}
  .btn-success{background:rgba(16,185,129,.15);color:${G.green};border:1px solid rgba(16,185,129,.3);padding:.55rem 1.1rem;font-size:.82rem;}
  .btn-success:hover{background:rgba(16,185,129,.25);}
  .btn-sm{padding:.35rem .8rem!important;font-size:.75rem!important;}

  .input{background:${G.surface};border:1px solid ${G.border};border-radius:8px;color:${G.text};font-family:'DM Sans',sans-serif;font-size:.875rem;padding:.65rem 1rem;width:100%;transition:border .2s;outline:none;}
  .input:focus{border-color:${G.accent};}
  .input::placeholder{color:${G.muted};}
  label{font-size:.72rem;color:${G.muted};display:block;margin-bottom:.4rem;font-weight:500;letter-spacing:.04em;text-transform:uppercase;}

  .card{background:${G.card};border:1px solid ${G.border};border-radius:12px;padding:1.5rem;}
  .card-sm{background:${G.card};border:1px solid ${G.border};border-radius:10px;padding:1rem;}

  .login-wrap{min-height:100vh;display:flex;align-items:center;justify-content:center;background:${G.bg};position:relative;overflow:hidden;}
  .login-bg{position:absolute;inset:0;background:radial-gradient(ellipse 60% 50% at 50% 0%,rgba(245,166,35,.08) 0%,transparent 70%);pointer-events:none;}
  .login-box{width:100%;max-width:420px;z-index:1;padding:1rem;}
  .login-brand{text-align:center;margin-bottom:2.5rem;}
  .login-emblem{width:96px;height:96px;border-radius:50%;overflow:hidden;margin:0 auto 1rem;display:flex;align-items:center;justify-content:center;background:#fff;padding:6px;box-shadow:0 0 40px rgba(245,166,35,.3);}
  .login-emblem img{width:100%;height:100%;object-fit:contain;}
  .login-title{font-family:'Syne',sans-serif;font-weight:800;font-size:1.5rem;margin-bottom:.25rem;}
  .login-sub{font-size:.82rem;color:${G.muted};}
  .tab-row{display:grid;grid-template-columns:1fr 1fr;background:${G.surface};border-radius:10px;border:1px solid ${G.border};margin-bottom:1.5rem;padding:4px;gap:4px;}
  .tab{padding:.6rem;text-align:center;border-radius:7px;cursor:pointer;font-size:.82rem;font-weight:500;color:${G.muted};border:none;background:transparent;font-family:'DM Sans',sans-serif;transition:all .2s;}
  .tab.active{background:${G.card};color:${G.text};border:1px solid ${G.border};}
  .form-group{margin-bottom:1.1rem;}
  .login-footer{text-align:center;margin-top:1.25rem;font-size:.72rem;color:${G.muted};}

  .main{flex:1;padding:2rem;max-width:1200px;margin:0 auto;width:100%;}
  .page-title{font-family:'Syne',sans-serif;font-weight:800;font-size:1.5rem;margin-bottom:.25rem;}
  .page-sub{color:${G.muted};font-size:.82rem;margin-bottom:2rem;}

  .stats-row{display:grid;grid-template-columns:repeat(4,1fr);gap:1rem;margin-bottom:2rem;}
  @media(max-width:700px){.stats-row{grid-template-columns:1fr 1fr;}}
  .stat-card{background:${G.card};border:1px solid ${G.border};border-radius:12px;padding:1.25rem 1.5rem;}
  .stat-num{font-family:'Syne',sans-serif;font-weight:800;font-size:1.8rem;color:${G.accent};}
  .stat-label{font-size:.72rem;color:${G.muted};text-transform:uppercase;letter-spacing:.06em;margin-top:.2rem;}

  .admin-nav{display:flex;gap:.5rem;margin-bottom:2rem;flex-wrap:wrap;}
  .nav-tab{background:${G.surface};border:1px solid ${G.border};border-radius:8px;padding:.5rem 1rem;cursor:pointer;font-size:.8rem;color:${G.muted};font-family:'DM Sans',sans-serif;transition:all .2s;}
  .nav-tab.active{background:rgba(245,166,35,.12);color:${G.accent};border-color:rgba(245,166,35,.4);}

  .table-wrap{overflow-x:auto;}
  table{width:100%;border-collapse:collapse;}
  th{text-align:left;font-size:.7rem;color:${G.muted};text-transform:uppercase;letter-spacing:.06em;padding:.75rem 1rem;border-bottom:1px solid ${G.border};}
  td{padding:.8rem 1rem;border-bottom:1px solid rgba(30,45,69,.5);font-size:.85rem;vertical-align:middle;}
  tr:last-child td{border-bottom:none;}
  .badge{display:inline-flex;align-items:center;gap:.35rem;border-radius:20px;padding:.2rem .65rem;font-size:.7rem;font-weight:500;}
  .badge-green{background:rgba(16,185,129,.12);color:${G.green};border:1px solid rgba(16,185,129,.25);}
  .badge-yellow{background:rgba(245,166,35,.12);color:${G.accent};border:1px solid rgba(245,166,35,.25);}
  .badge-red{background:rgba(239,68,68,.12);color:${G.red};border:1px solid rgba(239,68,68,.25);}
  .avatar{width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:'Syne',sans-serif;font-weight:700;font-size:.8rem;color:#fff;flex-shrink:0;}

  .positions-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:1rem;margin-bottom:2rem;}
  .pos-card{background:${G.card};border:1px solid ${G.border};border-radius:12px;padding:1.25rem;cursor:pointer;transition:all .2s;position:relative;}
  .pos-card:hover{border-color:${G.accent};transform:translateY(-2px);}
  .pos-card.voted{border-color:rgba(16,185,129,.5);}
  .pos-name{font-family:'Syne',sans-serif;font-weight:700;font-size:.95rem;margin-bottom:.5rem;}
  .pos-meta{font-size:.72rem;color:${G.muted};}
  .check-badge{position:absolute;top:.75rem;right:.75rem;width:20px;height:20px;background:${G.green};border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:.6rem;color:#fff;}

  .candidates-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:1rem;}
  .cand-card{background:${G.card};border:2px solid ${G.border};border-radius:14px;padding:1.5rem;cursor:pointer;transition:all .2s;text-align:center;}
  .cand-card:hover{border-color:rgba(245,166,35,.5);transform:translateY(-2px);}
  .cand-card.selected{border-color:${G.accent};background:rgba(245,166,35,.06);}
  .cand-avatar{width:64px;height:64px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:'Syne',sans-serif;font-weight:800;font-size:1.25rem;color:#fff;margin:0 auto 1rem;box-shadow:0 4px 16px rgba(0,0,0,.4);}
  .cand-name{font-family:'Syne',sans-serif;font-weight:700;font-size:1rem;margin-bottom:.5rem;}
  .cand-manifesto{font-size:.78rem;color:${G.muted};line-height:1.5;}

  .modal-backdrop{position:fixed;inset:0;background:rgba(0,0,0,.75);z-index:200;display:flex;align-items:center;justify-content:center;padding:1rem;}
  .modal{background:${G.surface};border:1px solid ${G.border};border-radius:16px;padding:2rem;width:100%;max-width:480px;max-height:90vh;overflow-y:auto;}
  .modal-title{font-family:'Syne',sans-serif;font-weight:800;font-size:1.1rem;margin-bottom:1.5rem;}
  .modal-actions{display:flex;gap:.75rem;justify-content:flex-end;margin-top:1.5rem;}

  .result-pos{margin-bottom:2rem;}
  .result-pos-title{font-family:'Syne',sans-serif;font-weight:700;font-size:.85rem;margin-bottom:.75rem;color:${G.muted};text-transform:uppercase;letter-spacing:.08em;}
  .result-item{background:${G.card};border:1px solid ${G.border};border-radius:10px;padding:1rem 1.25rem;margin-bottom:.65rem;display:flex;align-items:center;gap:1rem;}
  .result-item.winner{border-color:rgba(245,166,35,.5);background:rgba(245,166,35,.04);}
  .result-bar-wrap{flex:1;background:${G.surface};border-radius:4px;height:6px;overflow:hidden;}
  .result-bar{height:100%;border-radius:4px;background:${G.accent};transition:width 1s ease;}
  .result-item.winner .result-bar{background:${G.green};}
  .result-pct{font-family:'Syne',sans-serif;font-weight:700;font-size:.9rem;min-width:42px;text-align:right;}

  .chart-card{background:${G.card};border:1px solid ${G.border};border-radius:12px;padding:1.5rem;margin-bottom:2rem;}
  .chart-toggle-btn{background:${G.surface};border:1px solid ${G.border};border-radius:8px;padding:.4rem .9rem;font-size:.75rem;color:${G.muted};cursor:pointer;font-family:'DM Sans',sans-serif;transition:all .2s;}
  .chart-toggle-btn.active{background:rgba(245,166,35,.12);color:${G.accent};border-color:rgba(245,166,35,.4);}

  .section-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:1.25rem;flex-wrap:wrap;gap:.75rem;}
  .section-title{font-family:'Syne',sans-serif;font-weight:700;font-size:1rem;}
  .alert{border-radius:8px;padding:.75rem 1rem;font-size:.82rem;margin-bottom:1rem;}
  .alert-red{background:rgba(239,68,68,.1);border:1px solid rgba(239,68,68,.3);color:${G.red};}
  .alert-green{background:rgba(16,185,129,.1);border:1px solid rgba(16,185,129,.3);color:${G.green};}
  .empty{text-align:center;padding:3rem;color:${G.muted};font-size:.85rem;}

  .search-bar{position:relative;margin-bottom:1rem;}
  .search-bar .input{padding-left:2.5rem;}
  .search-icon{position:absolute;left:.85rem;top:50%;transform:translateY(-50%);color:${G.muted};}

  .import-zone{border:2px dashed ${G.border};border-radius:10px;padding:2rem;text-align:center;cursor:pointer;transition:all .2s;margin-bottom:1rem;color:${G.muted};}
  .import-zone:hover{border-color:${G.accent};color:${G.accent};}
  .import-zone-title{font-family:'Syne',sans-serif;font-weight:700;margin:.5rem 0 .25rem;}
  .import-zone-sub{font-size:.75rem;}

  .pagination{display:flex;gap:.4rem;align-items:center;margin-top:1rem;flex-wrap:wrap;}
  .page-btn{background:${G.surface};border:1px solid ${G.border};border-radius:6px;padding:.35rem .7rem;font-size:.75rem;cursor:pointer;color:${G.muted};font-family:'DM Sans',sans-serif;}
  .page-btn.active{background:rgba(245,166,35,.12);color:${G.accent};border-color:rgba(245,166,35,.4);}
  .page-btn:disabled{opacity:.4;cursor:not-allowed;}

  .success-screen{text-align:center;padding:4rem 2rem;}
  .success-icon{font-size:3rem;margin-bottom:1rem;}
  .success-title{font-family:'Syne',sans-serif;font-weight:800;font-size:1.5rem;margin-bottom:.5rem;}
  .success-sub{color:${G.muted};font-size:.9rem;}

  .spinner{display:inline-block;width:18px;height:18px;border:2px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:spin .7s linear infinite;}
  @keyframes spin{to{transform:rotate(360deg);}}
  .loading-screen{min-height:60vh;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:1rem;color:${G.muted};}

  @media(max-width:600px){.main{padding:1rem;}.stats-row{grid-template-columns:1fr 1fr;}.modal{padding:1.25rem;}}
`;

// ─── Icon Component ───────────────────────────────────────────────────────────
function Icon({ name, size = 14 }) {
  const icons = {
    logout: "M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1",
    check:  "M5 13l4 4L19 7",
    plus:   "M12 4v16m8-8H4",
    trash:  "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16",
    eye:    "M15 12a3 3 0 11-6 0 3 3 0 016 0zm-9.9-.5C6.2 7 8.9 5 12 5s5.8 2 6.9 6.5",
    lock:   "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
    ballot: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
    upload: "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12",
    search: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
    down:   "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4",
    refresh:"M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15",
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d={icons[name] || ""} />
    </svg>
  );
}

// ─── Custom Chart Tooltip ─────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const row = payload[0].payload;
  return (
    <div style={{ background: G.surface, border: `1px solid ${G.border}`, borderRadius: 8, padding: "8px 12px", fontSize: ".78rem" }}>
      <div style={{ fontFamily: "Syne", fontWeight: 700, marginBottom: 2 }}>{row.fullName || row.name}</div>
      <div style={{ color: G.accent }}>{(row.votes || 0).toLocaleString()} vote{row.votes !== 1 ? "s" : ""} · {row.pct}%</div>
    </div>
  );
};

// ─── Root App ─────────────────────────────────────────────────────────────────
export default function VotingPlatform() {
  const [session, setSession] = useState(null);
  return (
    <>
      <style>{css}</style>
      <div className="app">
        {!session
          ? <LoginPage onLogin={(role, data) => setSession({ role, ...data })} />
          : session.role === "admin"
            ? <AdminApp onLogout={() => setSession(null)} />
            : <StudentApp student={session.student} onLogout={() => setSession(null)} />
        }
      </div>
    </>
  );
}

// ─── Login ────────────────────────────────────────────────────────────────────
function LoginPage({ onLogin }) {
  const [tab, setTab]     = useState("student");
  const [regNo, setRegNo] = useState("");
  const [code, setCode]   = useState("");
  const [aId, setAId]     = useState("");
  const [aPwd, setAPwd]   = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const loginStudent = async () => {
    if (!regNo.trim() || !code.trim()) return setError("Please fill in all fields.");
    setLoading(true); setError("");
    try {
      const data = await api("api/auth?type=student", {
        method: "POST",
        body: JSON.stringify({ regNo: regNo.trim(), votingCode: code.trim() }),
      });
      onLogin("student", { student: data.student });
    } catch (e) { setError(e.message || "Invalid credentials."); }
    setLoading(false);
  };

  const loginAdmin = async () => {
    if (!aId.trim() || !aPwd.trim()) return setError("Please fill in all fields.");
    setLoading(true); setError("");
    try {
      await api("api/auth?type=admin", {
        method: "POST",
        body: JSON.stringify({ id: aId.trim(), password: aPwd.trim() }),
      });
      onLogin("admin", {});
    } catch (e) { setError(e.message || "Invalid credentials."); }
    setLoading(false);
  };

  return (
    <div className="login-wrap">
      <div className="login-bg" />
      <div className="login-box">
        <div className="login-brand">
          <div className="login-emblem"><img src={BADGE_SRC} alt="Butende Technical Institute" /></div>
          <div className="login-title">Election Portal</div>
          <div className="login-sub">Butende Technical Institute · Student Guild Elections</div>
        </div>
        <div className="card">
          <div className="tab-row">
            <button className={`tab ${tab === "student" ? "active" : ""}`} onClick={() => { setTab("student"); setError(""); }}>🗳 Student</button>
            <button className={`tab ${tab === "admin"   ? "active" : ""}`} onClick={() => { setTab("admin");   setError(""); }}>⚙ Admin</button>
          </div>
          {error && <div className="alert alert-red">{error}</div>}
          {tab === "student" ? (
            <>
              <div className="form-group">
                <label>Registration Number</label>
                <input className="input" placeholder="e.g. UBB.../UVT..." value={regNo} onChange={e => setRegNo(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Voting Code</label>
                <input className="input" type="password" placeholder="Your unique code" value={code} onChange={e => setCode(e.target.value)} onKeyDown={e => e.key === "Enter" && loginStudent()} />
              </div>
              <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }} onClick={loginStudent} disabled={loading}>
                {loading ? <span className="spinner" /> : <Icon name="ballot" />} {loading ? "Logging in..." : "Enter & Vote"}
              </button>
              <div className="login-footer">Contact the election administrator if you have not received your voting code.</div>
              <div className="login-footer">Developed by Kimera Ian and Bukenya Kityo Ratif</div>
            </>
          ) : (
            <>
              <div className="form-group">
                <label>Admin ID</label>
                <input className="input" placeholder="Strictly admins only" value={aId} onChange={e => setAId(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input className="input" type="password" placeholder="***********" value={aPwd} onChange={e => setAPwd(e.target.value)} onKeyDown={e => e.key === "Enter" && loginAdmin()} />
              </div>
              <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }} onClick={loginAdmin} disabled={loading}>
                {loading ? <span className="spinner" /> : <Icon name="lock" />} {loading ? "Logging in..." : "Admin Access"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Admin App (loads all data once, passes down) ─────────────────────────────
function AdminApp({ onLogout }) {
  const [tab, setTab]               = useState("dashboard");
  const [positions, setPositions]   = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [students, setStudents]     = useState([]);
  const [results, setResults]       = useState([]);
  const [status, setStatus]         = useState({ is_open: "0", results_published: "0" });
  const [loading, setLoading]       = useState(true);

  const electionOpen      = status.is_open === "TRUE" || status.is_open === "1" || status.is_open === 1 || status.is_open === true
  const resultsPublished  = status.results_published === "TRUE" || status.results_published === "1" || status.results_published === 1 || status.results_published === true

  const loadAll = async () => {
    try {
      const [p, c, s, r, st] = await Promise.all([
        api("api/positions"),
        api("api/candidates"),
        api("api/voters"),
        api("api/votes?results"),
        api("api/votes?status"),
      ]);
      setPositions(p);
      setCandidates(c.map(x => ({ ...x, positionId: x.position_id })));
      setStudents(s.map(x => ({ ...x, regNo: x.reg_no, votingCode: x.voting_code, hasVoted: x.has_voted === "TRUE" || x.has_voted === "1" || x.has_voted === 1 || x.has_voted === true })));
      setResults(r);
      setStatus(st);
    } catch(e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { loadAll(); }, []);

  const totalVoters = students.length;
  const votedCount  = students.filter(s => s.hasVoted).length;

  const getVoteCount    = (cId)  => { const r = results.find(x => String(x.id) === String(cId)); return r ? (parseInt(r.vote_count) || 0) : 0; };
  const getPositionTotal = (pId) => candidates.filter(c => String(c.positionId) === String(pId)).reduce((sum, c) => sum + getVoteCount(c.id), 0);

  const setElectionOpen = async (val) => {
    const s = { is_open: val ? "TRUE" : "FALSE", results_published: resultsPublished ? "TRUE" : "FALSE" };
    await api("api/votes?status", { method: "PATCH", body: JSON.stringify(s) });
    setStatus(prev => ({ ...prev, is_open: val ? "TRUE" : "FALSE" }));
  };
  const setResultsPublished = async (val) => {
    const s = { is_open: electionOpen ? "TRUE" : "FALSE", results_published: val ? "TRUE" : "FALSE" };
    await api("api/votes?status", { method: "PATCH", body: JSON.stringify(s) });
    setStatus(prev => ({ ...prev, results_published: val ? "TRUE" : "FALSE" }));
    if (val) { 
  const r = await api("api/votes?results"); 
  setResults(r);
  const s2 = await api("api/voters");
  setStudents(s2.map(x => ({ ...x, regNo: x.reg_no, votingCode: x.voting_code, hasVoted: x.has_voted === "TRUE" || x.has_voted === "1" || x.has_voted === 1 || x.has_voted === true })));
}
  };

  if (loading) return (
    <>
      <style>{css}</style>
      <div className="loading-screen"><div className="spinner" style={{ width: 36, height: 36, borderWidth: 3, borderColor: `${G.border}`, borderTopColor: G.accent }} /><div>Loading election data…</div></div>
    </>
  );

  const props = { positions, setPositions, candidates, setCandidates, students, setStudents,
    results, setResults, totalVoters, votedCount, electionOpen, setElectionOpen,
    resultsPublished, setResultsPublished, getVoteCount, getPositionTotal, reload: loadAll };

  return (
    <>
      <header className="header">
        <div className="header-logo">
          <div className="logo-icon"><img src={BADGE_SRC} alt="BTI" /></div>
          <div><div className="logo-text">Admin Panel</div><span className="logo-sub">Butende Technical Institute</span></div>
        </div>
        <div className="header-right">
          <div className={`election-badge ${electionOpen ? "" : "closed"}`}>
            <span className="dot" />{electionOpen ? "Election Open" : "Election Closed"}
          </div>
          <button className="btn btn-ghost btn-sm" onClick={() => loadAll()} title="Refresh"><Icon name="refresh" size={13} /></button>
          <button className="btn btn-ghost btn-sm" onClick={onLogout}><Icon name="logout" /> Logout</button>
        </div>
      </header>
      <div className="main">
        <div className="page-title">Admin Dashboard</div>
        <div className="page-sub">Guild Elections Management · Butende Technical Institute</div>
        <div className="admin-nav">
          {["dashboard","candidates","positions","voters","results"].map(t => (
            <button key={t} className={`nav-tab ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
        {tab === "dashboard"  && <AdminDashboard  {...props} />}
        {tab === "candidates" && <CandidatesManager {...props} />}
        {tab === "positions"  && <PositionsManager  {...props} />}
        {tab === "voters"     && <VotersManager     {...props} />}
        {tab === "results"    && <ResultsView {...props} isAdmin />}
      </div>
    </>
  );
}

// ─── Admin Dashboard ──────────────────────────────────────────────────────────
function AdminDashboard({ candidates, totalVoters, votedCount, electionOpen, setElectionOpen, resultsPublished, setResultsPublished }) {
  const pct = totalVoters ? Math.round((votedCount / totalVoters) * 100) : 0;
  const [saving, setSaving] = useState(false);

  const toggleElection = async () => {
    setSaving(true);
    await setElectionOpen(!electionOpen);
    setSaving(false);
  };
  const toggleResults = async () => {
    setSaving(true);
    await setResultsPublished(!resultsPublished);
    setSaving(false);
  };

  return (
    <>
      <div className="stats-row">
        <div className="stat-card"><div className="stat-num">{totalVoters.toLocaleString()}</div><div className="stat-label">Registered Voters</div></div>
        <div className="stat-card"><div className="stat-num" style={{ color: G.green }}>{votedCount.toLocaleString()}</div><div className="stat-label">Votes Cast</div></div>
        <div className="stat-card"><div className="stat-num">{candidates.length}</div><div className="stat-label">Candidates</div></div>
        <div className="stat-card"><div className="stat-num">{pct}%</div><div className="stat-label">Turnout</div></div>
      </div>
      <div className="card" style={{ marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: ".75rem" }}>
          <span style={{ fontFamily: "Syne", fontWeight: 700 }}>Voter Participation</span>
          <span style={{ color: G.accent, fontFamily: "Syne", fontWeight: 700 }}>{votedCount.toLocaleString()} / {totalVoters.toLocaleString()}</span>
        </div>
        <div style={{ background: G.surface, borderRadius: 6, height: 12, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${pct}%`, background: `linear-gradient(90deg,${G.accent},${G.green})`, borderRadius: 6, transition: "width 1s ease" }} />
        </div>
      </div>
      <div className="card">
        <div className="section-head"><span className="section-title">Election Controls</span></div>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <button className={`btn ${electionOpen ? "btn-danger" : "btn-success"}`} onClick={toggleElection} disabled={saving}>
            {saving ? <span className="spinner" /> : (electionOpen ? "⏹ Close Election" : "▶ Open Election")}
          </button>
          <button className={`btn ${resultsPublished ? "btn-ghost" : "btn-primary"}`}
            onClick={toggleResults} disabled={electionOpen || saving}>
            <Icon name="eye" /> {resultsPublished ? "Unpublish Results" : "Publish Results"}
          </button>
        </div>
        {electionOpen && <p style={{ fontSize: ".75rem", color: G.muted, marginTop: ".75rem" }}>Close the election first to publish results.</p>}
      </div>
    </>
  );
}

// ─── Positions Manager ────────────────────────────────────────────────────────
function PositionsManager({ positions, setPositions, candidates }) {
  const [name, setName]   = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const add = async () => {
    if (!name.trim()) return setError("Position name required.");
    if (positions.find(p => p.name.toLowerCase() === name.toLowerCase())) return setError("Position already exists.");
    setSaving(true);
    try {
      const newPos = await api("api/positions", { method: "POST", body: JSON.stringify({ name: name.trim() }) });
      setPositions(prev => [...prev, newPos]);
      setName(""); setError("");
    } catch(e) { setError(e.message); }
    setSaving(false);
  };

  const remove = async (id) => {
    if (candidates.some(c => String(c.positionId) === String(id))) return setError("Remove candidates for this position first.");
    try {
      await api(`api/positions?id=${id}`, { method: "DELETE" });
      setPositions(prev => prev.filter(p => String(p.id) !== String(id)));
      setError("");
    } catch(e) { setError(e.message); }
  };

  return (
    <div className="card">
      <div className="section-head"><span className="section-title">Election Positions</span></div>
      {error && <div className="alert alert-red">{error}</div>}
      <div style={{ display: "flex", gap: ".75rem", marginBottom: "1.5rem" }}>
        <input className="input" placeholder="e.g. Guild President" value={name}
          onChange={e => setName(e.target.value)} onKeyDown={e => e.key === "Enter" && add()} style={{ flex: 1 }} />
        <button className="btn btn-primary" onClick={add} disabled={saving}>
          {saving ? <span className="spinner" /> : <Icon name="plus" />} Add
        </button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: ".6rem" }}>
        {positions.map((p, i) => {
          const cnt = candidates.filter(c => String(c.positionId) === String(p.id)).length;
          return (
            <div key={p.id} className="card-sm" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: ".75rem" }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: CHART_COLORS[i % CHART_COLORS.length], display: "flex", alignItems: "center", justifyContent: "center", fontSize: ".7rem", fontWeight: 700, color: "#0a0e1a" }}>{i + 1}</div>
                <div>
                  <div style={{ fontFamily: "Syne", fontWeight: 600 }}>{p.name}</div>
                  <div style={{ fontSize: ".72rem", color: G.muted }}>{cnt} candidate{cnt !== 1 ? "s" : ""}</div>
                </div>
              </div>
              <button className="btn btn-danger btn-sm" onClick={() => remove(p.id)}><Icon name="trash" /></button>
            </div>
          );
        })}
        {positions.length === 0 && <div className="empty">No positions yet. Add your first position above.</div>}
      </div>
    </div>
  );
}

// ─── Candidates Manager ───────────────────────────────────────────────────────
function CandidatesManager({ candidates, setCandidates, positions, getVoteCount }) {
  const [show, setShow]   = useState(false);
  const [form, setForm]   = useState({ name: "", positionId: "", manifesto: "", initials: "", color: "#f5a623" });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!form.name.trim() || !form.positionId) return setError("Name and position required.");
    setSaving(true);
    try {
      const initials = form.initials.trim() || form.name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
      const newC = await api("api/candidates", {
        method: "POST",
        body: JSON.stringify({ name: form.name.trim(), position_id: form.positionId, manifesto: form.manifesto, initials, color: form.color }),
      });
      setCandidates(prev => [...prev, { ...newC, positionId: newC.position_id }]);
      setShow(false); setForm({ name: "", positionId: "", manifesto: "", initials: "", color: "#f5a623" }); setError("");
    } catch(e) { setError(e.message); }
    setSaving(false);
  };

  const remove = async (id) => {
    try {
      await api(`api/candidates?id=${id}`, { method: "DELETE" });
      setCandidates(prev => prev.filter(c => String(c.id) !== String(id)));
    } catch(e) { alert(e.message); }
  };

  return (
    <>
      <div className="card">
        <div className="section-head">
          <span className="section-title">Candidates ({candidates.length})</span>
          <button className="btn btn-primary btn-sm" onClick={() => setShow(true)} disabled={positions.length === 0}>
            <Icon name="plus" /> Add Candidate
          </button>
        </div>
        {positions.length === 0 && <div className="alert alert-red">Create positions first before adding candidates.</div>}
        <div className="table-wrap">
          <table>
            <thead><tr><th>Candidate</th><th>Position</th><th>Votes</th><th>Manifesto</th><th></th></tr></thead>
            <tbody>
              {candidates.map(c => {
                const pos = positions.find(p => String(p.id) === String(c.positionId));
                return (
                  <tr key={c.id}>
                    <td><div style={{ display: "flex", alignItems: "center", gap: ".75rem" }}><div className="avatar" style={{ background: c.color }}>{c.initials}</div><span style={{ fontWeight: 500 }}>{c.name}</span></div></td>
                    <td><span className="badge badge-yellow">{pos?.name || "—"}</span></td>
                    <td style={{ fontFamily: "Syne", fontWeight: 700, color: G.accent }}>{getVoteCount(c.id).toLocaleString()}</td>
                    <td style={{ maxWidth: 200, color: G.muted, fontSize: ".78rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.manifesto || "—"}</td>
                    <td><button className="btn btn-danger btn-sm" onClick={() => remove(c.id)}><Icon name="trash" /></button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {candidates.length === 0 && <div className="empty">No candidates yet.</div>}
        </div>
      </div>

      {show && (
        <div className="modal-backdrop" onClick={() => setShow(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">Add Candidate</div>
            {error && <div className="alert alert-red">{error}</div>}
            <div className="form-group"><label>Full Name</label><input className="input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Nakato Aisha" /></div>
            <div className="form-group">
              <label>Position</label>
              <select className="input" value={form.positionId} onChange={e => setForm({ ...form, positionId: e.target.value })}>
                <option value="">— Select position —</option>
                {positions.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div className="form-group"><label>Initials (auto if blank)</label><input className="input" value={form.initials} onChange={e => setForm({ ...form, initials: e.target.value })} placeholder="e.g. NA" maxLength={2} /></div>
            <div className="form-group"><label>Avatar Color</label><input type="color" className="input" style={{ height: 44, padding: ".2rem .5rem" }} value={form.color} onChange={e => setForm({ ...form, color: e.target.value })} /></div>
            <div className="form-group"><label>Manifesto</label><textarea className="input" rows={3} value={form.manifesto} onChange={e => setForm({ ...form, manifesto: e.target.value })} placeholder="Campaign statement..." /></div>
            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={() => setShow(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={save} disabled={saving}>{saving ? <span className="spinner" /> : "Save"}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ─── Voters Manager ───────────────────────────────────────────────────────────
function VotersManager({ students, setStudents }) {
  const [showManual, setShowManual] = useState(false);
  const [form, setForm]   = useState({ name: "", regNo: "", votingCode: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [search, setSearch]   = useState("");
  const [page, setPage]       = useState(1);
  const [csvRows, setCsvRows] = useState([]);
  const [csvPreview, setCsvPreview] = useState(null);
  const [saving, setSaving]   = useState(false);
  const fileRef = useRef();
  const PAGE_SIZE = 50;

  const filtered   = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    (s.regNo || "").toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const flash = (msg) => { setSuccess(msg); setTimeout(() => setSuccess(""), 5000); };

  const saveManual = async () => {
    if (!form.name.trim() || !form.regNo.trim() || !form.votingCode.trim()) return setError("All fields required.");
    setSaving(true);
    try {
      const s = await api("api/voters", {
        method: "POST",
        body: JSON.stringify({ name: form.name.trim(), reg_no: form.regNo.trim(), voting_code: form.votingCode.trim() }),
      });
      setStudents(prev => [...prev, { ...s, regNo: s.reg_no, votingCode: s.voting_code, hasVoted: false }]);
      setForm({ name: "", regNo: "", votingCode: "" }); setError("");
      flash("Voter added successfully."); setShowManual(false);
    } catch(e) { setError(e.message); }
    setSaving(false);
  };

  const handleCSV = (e) => {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const lines = ev.target.result.split("\n").map(l => l.trim()).filter(Boolean);
      const rows = [];
      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(",").map(c => c.replace(/^"|"$/g, "").trim());
        if (cols.length >= 3 && cols[0] && cols[1] && cols[2]) rows.push({ name: cols[0], reg_no: cols[1], voting_code: cols[2] });
      }
      setCsvRows(rows); setCsvPreview(rows.slice(0, 5)); setError("");
    };
    reader.readAsText(file); e.target.value = "";
  };

  const importCSV = async () => {
    if (!csvRows.length) return;
    setSaving(true);
    try {
      const res = await api("api/voters", { method: "POST", body: JSON.stringify({ students: csvRows }) });
      flash(`Imported ${res.count} voter${res.count !== 1 ? "s" : ""} successfully.`);
      // Reload student list
      const updated = await api("api/voters");
      setStudents(updated.map(x => ({ ...x, regNo: x.reg_no, votingCode: x.voting_code, hasVoted: x.has_voted === "TRUE" || x.has_voted === "1" || x.has_voted === 1 || x.has_voted === true })));
      setCsvRows([]); setCsvPreview(null);
    } catch(e) { setError(e.message); }
    setSaving(false);
  };

  const removeStudent = async (id) => {
    try {
      await api(`api/voters?id=${id}`, { method: "DELETE" });
      setStudents(prev => prev.filter(s => String(s.id) !== String(id)));
    } catch(e) { alert(e.message); }
  };

  const resetVote = async (id) => {
    try {
      await api(`api/voters?id=${id}`, { method: "PATCH" });
      setStudents(prev => prev.map(s => String(s.id) === String(id) ? { ...s, hasVoted: false } : s));
    } catch(e) { alert(e.message); }
  };

  const downloadTemplate = () => {
    const blob = new Blob(["name,reg_no,voting_code\nJohn Doe,BTI/2026/001,VC001\nJane Smith,BTI/2026/002,VC002"], { type: "text/csv" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "voters_template.csv"; a.click();
  };

  return (
    <>
      <div className="card" style={{ marginBottom: "1.25rem" }}>
        <div className="section-head">
          <span className="section-title">Bulk Import via CSV</span>
          <button className="btn btn-ghost btn-sm" onClick={downloadTemplate}><Icon name="down" size={12} /> Template</button>
        </div>
        <div className="import-zone" onClick={() => fileRef.current?.click()}>
          <Icon name="upload" size={28} />
          <div className="import-zone-title">Click to upload CSV</div>
          <div className="import-zone-sub">Columns: name, reg_no, voting_code · Supports 600+ rows · Duplicates auto-skipped</div>
        </div>
        <input ref={fileRef} type="file" accept=".csv" style={{ display: "none" }} onChange={handleCSV} />
        {csvPreview && (
          <>
            <div style={{ fontSize: ".72rem", color: G.muted, margin: ".75rem 0 .4rem" }}>Preview — first 5 of {csvRows.length} rows:</div>
            <div style={{ overflowX: "auto", marginBottom: "1rem" }}>
              <table style={{ width: "100%", fontSize: ".78rem" }}>
                <thead><tr><th>Name</th><th>Reg. No.</th><th>Voting Code</th></tr></thead>
                <tbody>{csvPreview.map((r, i) => <tr key={i}><td>{r.name}</td><td>{r.reg_no}</td><td>{r.voting_code}</td></tr>)}</tbody>
              </table>
            </div>
            <div style={{ display: "flex", gap: ".75rem" }}>
              <button className="btn btn-primary" onClick={importCSV} disabled={saving}>
                {saving ? <span className="spinner" /> : <Icon name="upload" size={13} />} Import {csvRows.length.toLocaleString()} Voters
              </button>
              <button className="btn btn-ghost" onClick={() => { setCsvRows([]); setCsvPreview(null); }}>Clear</button>
            </div>
          </>
        )}
      </div>

      <div className="card">
        <div className="section-head">
          <span className="section-title">Registered Voters ({students.length.toLocaleString()})</span>
          <button className="btn btn-primary btn-sm" onClick={() => setShowManual(true)}><Icon name="plus" /> Add Single</button>
        </div>
        {error   && <div className="alert alert-red">{error}</div>}
        {success && <div className="alert alert-green">{success}</div>}
        <div className="search-bar">
          <span className="search-icon"><Icon name="search" size={14} /></span>
          <input className="input" placeholder="Search name or registration number…" value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }} />
        </div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>#</th><th>Name</th><th>Reg. No.</th><th>Voting Code</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {paginated.map((s, i) => (
                <tr key={s.id}>
                  <td style={{ color: G.muted, fontSize: ".75rem" }}>{(page - 1) * PAGE_SIZE + i + 1}</td>
                  <td style={{ fontWeight: 500 }}>{s.name}</td>
                  <td style={{ color: G.muted, fontFamily: "monospace", fontSize: ".8rem" }}>{s.regNo || s.reg_no}</td>
                  <td style={{ fontFamily: "monospace", color: G.accent, fontSize: ".8rem" }}>{s.votingCode || s.voting_code}</td>
                  <td>{s.hasVoted ? <span className="badge badge-green"><Icon name="check" size={10} /> Voted</span> : <span className="badge badge-yellow">Pending</span>}</td>
                  <td style={{ display: "flex", gap: ".4rem" }}>
                    {s.hasVoted && <button className="btn btn-ghost btn-sm" onClick={() => resetVote(s.id)}>Reset</button>}
                    <button className="btn btn-danger btn-sm" onClick={() => removeStudent(s.id)}><Icon name="trash" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <div className="empty">{search ? "No voters match your search." : "No voters registered yet."}</div>}
        </div>
        {totalPages > 1 && (
          <div className="pagination">
            <button className="page-btn" onClick={() => setPage(p => p - 1)} disabled={page === 1}>← Prev</button>
            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
              const p = page <= 4 ? i + 1 : page - 3 + i;
              if (p < 1 || p > totalPages) return null;
              return <button key={p} className={`page-btn ${p === page ? "active" : ""}`} onClick={() => setPage(p)}>{p}</button>;
            })}
            <button className="page-btn" onClick={() => setPage(p => p + 1)} disabled={page === totalPages}>Next →</button>
            <span style={{ fontSize: ".72rem", color: G.muted }}>Page {page}/{totalPages} · {filtered.length.toLocaleString()} voters</span>
          </div>
        )}
      </div>

      {showManual && (
        <div className="modal-backdrop" onClick={() => setShowManual(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">Add Single Voter</div>
            {error && <div className="alert alert-red">{error}</div>}
            <div className="form-group"><label>Full Name</label><input className="input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Nalwanga Josephine" /></div>
            <div className="form-group"><label>Registration Number</label><input className="input" value={form.regNo} onChange={e => setForm({ ...form, regNo: e.target.value })} placeholder="BTI/2026/XXX" /></div>
            <div className="form-group"><label>Voting Code</label><input className="input" value={form.votingCode} onChange={e => setForm({ ...form, votingCode: e.target.value })} placeholder="Unique code e.g. VC001" /></div>
            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={() => setShowManual(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={saveManual} disabled={saving}>{saving ? <span className="spinner" /> : "Save Voter"}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ─── Results View ─────────────────────────────────────────────────────────────
function ResultsView({ positions, candidates, results, getVoteCount, getPositionTotal, resultsPublished, isAdmin }) {
  const [chartPos,  setChartPos]  = useState(null);
  const [chartType, setChartType] = useState("bar");

  if (isAdmin && !resultsPublished) {
    return (
      <div className="card" style={{ textAlign: "center", padding: "4rem" }}>
        <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>🔒</div>
        <div style={{ fontFamily: "Syne", fontWeight: 700, marginBottom: ".5rem" }}>Results Not Published</div>
        <div style={{ color: G.muted, fontSize: ".82rem" }}>Close the election then click "Publish Results" in the Dashboard tab.</div>
      </div>
    );
  }

  const activeId   = chartPos || positions[0]?.id;
  const activeName = positions.find(p => String(p.id) === String(activeId))?.name || "";

  const chartData = candidates
    .filter(c => String(c.positionId) === String(activeId))
    .map(c => {
      const v = getVoteCount(c.id);
      const t = getPositionTotal(activeId);
      return { id: c.id, name: c.name, shortName: c.name.split(" ")[0], fullName: c.name, color: c.color, votes: v, pct: t ? Math.round((v / t) * 100) : 0 };
    })
    .sort((a, b) => b.votes - a.votes);

  const pieData = chartData.map(c => ({ name: c.name, value: c.votes, fill: c.color }));

  const renderLabel = ({ cx, cy, midAngle, outerRadius, name, value }) => {
    if (value === 0) return null;
    const R = Math.PI / 180;
    const r = outerRadius + 28;
    const x = cx + r * Math.cos(-midAngle * R);
    const y = cy + r * Math.sin(-midAngle * R);
    const cd = chartData.find(c => c.name === name);
    return <text x={x} y={y} textAnchor={x > cx ? "start" : "end"} dominantBaseline="central" style={{ fontSize: "11px", fill: G.muted, fontFamily: "DM Sans" }}>{cd?.pct}%</text>;
  };

  return (
    <div>
      {!isAdmin && (
        <>
          <div className="page-title">Election Results</div>
          <div className="page-sub">Butende Technical Institute Guild Elections — Official Results</div>
        </>
      )}

      {positions.length > 0 && (
        <>
          <div style={{ display: "flex", gap: ".5rem", flexWrap: "wrap", marginBottom: "1rem" }}>
            {positions.map(p => (
              <button key={p.id} className={`chart-toggle-btn ${String(chartPos || positions[0]?.id) === String(p.id) ? "active" : ""}`}
                onClick={() => setChartPos(p.id)}>{p.name}</button>
            ))}
          </div>

          {chartData.length > 0 && (
            <div className="chart-card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", flexWrap: "wrap", gap: ".5rem" }}>
                <div style={{ fontFamily: "Syne", fontWeight: 700, fontSize: ".9rem" }}>{activeName} — Vote Distribution</div>
                <div style={{ display: "flex", gap: ".4rem" }}>
                  <button className={`chart-toggle-btn ${chartType === "bar" ? "active" : ""}`} onClick={() => setChartType("bar")}>📊 Bar</button>
                  <button className={`chart-toggle-btn ${chartType === "pie" ? "active" : ""}`} onClick={() => setChartType("pie")}>🥧 Pie</button>
                </div>
              </div>
              {chartType === "bar" ? (
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={G.border} vertical={false} />
                    <XAxis dataKey="shortName" tick={{ fill: G.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: G.muted, fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(245,166,35,.05)" }} />
                    <Bar dataKey="votes" radius={[6, 6, 0, 0]} maxBarSize={80}>
                      {chartData.map((e, i) => <Cell key={i} fill={e.color} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" outerRadius={95} innerRadius={40}
                      dataKey="value" nameKey="name" paddingAngle={3} labelLine={false} label={renderLabel}>
                      {pieData.map((e, i) => <Cell key={i} fill={e.fill} stroke="none" />)}
                    </Pie>
                    <Tooltip formatter={(v, n) => [`${v.toLocaleString()} votes`, n]}
                      contentStyle={{ background: G.surface, border: `1px solid ${G.border}`, borderRadius: 8, fontSize: ".78rem" }} />
                    <Legend formatter={v => <span style={{ fontSize: ".78rem", color: G.text }}>{v}</span>} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          )}
        </>
      )}

      {positions.map(pos => {
        const posCands = candidates.filter(c => String(c.positionId) === String(pos.id));
        const total    = getPositionTotal(pos.id);
        const sorted   = [...posCands].sort((a, b) => getVoteCount(b.id) - getVoteCount(a.id));
        return (
          <div key={pos.id} className="result-pos">
            <div className="result-pos-title">{pos.name}</div>
            <div className="card">
              {sorted.map((c, i) => {
                const cnt = getVoteCount(c.id);
                const pct = total ? Math.round((cnt / total) * 100) : 0;
                const isW = i === 0 && cnt > 0;
                return (
                  <div key={c.id} className={`result-item ${isW ? "winner" : ""}`}>
                    <div style={{ fontFamily: "Syne", fontWeight: 800, fontSize: "1rem", color: isW ? G.green : G.muted, minWidth: 22 }}>{i + 1}</div>
                    <div className="avatar" style={{ background: c.color, width: 32, height: 32, fontSize: ".7rem" }}>{c.initials}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: "Syne", fontWeight: 600, fontSize: ".85rem", marginBottom: ".35rem" }}>{c.name} {isW && "👑"}</div>
                      <div className="result-bar-wrap"><div className="result-bar" style={{ width: `${pct}%` }} /></div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div className="result-pct" style={{ color: isW ? G.green : G.text }}>{pct}%</div>
                      <div style={{ fontSize: ".7rem", color: G.muted }}>{cnt.toLocaleString()} vote{cnt !== 1 ? "s" : ""}</div>
                    </div>
                  </div>
                );
              })}
              {posCands.length === 0 && <div className="empty" style={{ padding: "1rem" }}>No candidates for this position.</div>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Student App ──────────────────────────────────────────────────────────────
function StudentApp({ student, onLogout }) {
  const [positions, setPositions]   = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [results, setResults]       = useState([]);
  const [status, setStatus]         = useState({ is_open: "0", results_published: "0" });
  const [votedPositions, setVotedPositions] = useState(new Set());
  const [loading, setLoading]       = useState(true);
  const [activePos, setActivePos]   = useState(null);
  const [selections, setSelections] = useState({});
  const [confirmModal, setConfirm]  = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const electionOpen     = status.is_open === "TRUE" || status.is_open === true;
  const resultsPublished = status.results_published === "TRUE" || status.results_published === true;
  const allVoted         = positions.length > 0 && positions.every(p => votedPositions.has(String(p.id)));

  const loadData = async () => {
    try {
      const [p, c, st, mv] = await Promise.all([
        api("api/positions"),
        api("api/candidates"),
        api("api/votes?status"),
        api(`api/votes?my_votes&student_id=${student.id}`),
      ]);
      setPositions(p);
      setCandidates(c.map(x => ({ ...x, positionId: x.position_id })));
      setStatus(st);
      setVotedPositions(new Set(mv.map(String)));
      if (st.results_published === "1" || st.results_published === 1) {
        const r = await api("api/votes?results");
        setResults(r);
      }
    } catch(e) { console.error(e); }
    setLoading(false);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
useEffect(() => { loadData(); }, []);

  const getVoteCount     = (cId) => { const r = results.find(x => String(x.id) === String(cId)); return r ? (parseInt(r.vote_count) || 0) : 0; };
  const getPositionTotal = (pId) => candidates.filter(c => String(c.positionId) === String(pId)).reduce((sum, c) => sum + getVoteCount(c.id), 0);

  const submitVote = async () => {
    const posId  = String(activePos.id);
    const candId = selections[posId];
    if (!candId) return;
    setSubmitting(true); setSubmitError("");
    try {
      await api("api/votes", {
        method: "POST",
        body: JSON.stringify({ student_id: student.id, position_id: activePos.id, candidate_id: candId }),
      });
      setVotedPositions(prev => new Set([...prev, posId]));
      setConfirm(false); setActivePos(null);
    } catch(e) { setSubmitError(e.message); }
    setSubmitting(false);
  };

  if (loading) return (
    <>
      <style>{css}</style>
      <div className="loading-screen">
        <div className="spinner" style={{ width: 36, height: 36, borderWidth: 3, borderColor: G.border, borderTopColor: G.accent }} />
        <div>Loading election data…</div>
      </div>
    </>
  );

  const posCandidates = activePos ? candidates.filter(c => String(c.positionId) === String(activePos.id)) : [];

  return (
    <>
      <header className="header">
        <div className="header-logo">
          <div className="logo-icon"><img src={BADGE_SRC} alt="BTI" /></div>
          <div><div className="logo-text">Student Portal</div><span className="logo-sub">{student.name}</span></div>
        </div>
        <div className="header-right">
          {electionOpen ? <div className="election-badge"><span className="dot" />Live</div>
                        : <div className="election-badge closed">Closed</div>}
          <button className="btn btn-ghost btn-sm" onClick={onLogout}><Icon name="logout" /> Exit</button>
        </div>
      </header>

      <div className="main">
        {!electionOpen && !resultsPublished && (
          <div className="card" style={{ textAlign: "center", padding: "4rem 2rem" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>🔒</div>
            <div style={{ fontFamily: "Syne", fontWeight: 800, fontSize: "1.3rem", marginBottom: ".5rem" }}>Election Closed</div>
            <div style={{ color: G.muted }}>Voting has ended. Results will be published shortly.</div>
          </div>
        )}

        {resultsPublished && (
          <ResultsView positions={positions} candidates={candidates} results={results}
            getVoteCount={getVoteCount} getPositionTotal={getPositionTotal}
            resultsPublished={true} isAdmin={false} />
        )}

        {electionOpen && !resultsPublished && (
          <>
            {!activePos && (
              <>
                <div className="page-title">Cast Your Vote</div>
                <div className="page-sub">
                  {allVoted ? "You have voted for all positions — thank you!" : `${votedPositions.size} of ${positions.length} position${positions.length !== 1 ? "s" : ""} voted · Select a position below`}
                </div>
                {allVoted ? (
                  <div className="success-screen">
                    <div className="success-icon">✅</div>
                    <div className="success-title">All Votes Submitted!</div>
                    <div className="success-sub">Thank you, {student.name.split(" ")[0]}. Your votes are permanently saved in the database.</div>
                  </div>
                ) : (
                  <div className="positions-grid">
                    {positions.map(pos => {
                      const voted   = votedPositions.has(String(pos.id));
                      const candCnt = candidates.filter(c => String(c.positionId) === String(pos.id)).length;
                      return (
                        <div key={pos.id} className={`pos-card ${voted ? "voted" : ""}`} onClick={() => !voted && setActivePos(pos)}>
                          {voted && <div className="check-badge">✓</div>}
                          <div className="pos-name">{pos.name}</div>
                          <div className="pos-meta">{candCnt} candidate{candCnt !== 1 ? "s" : ""}</div>
                          <div style={{ marginTop: ".75rem" }}>
                            {voted ? <span className="badge badge-green"><Icon name="check" size={10} /> Voted</span>
                                   : <span className="badge badge-yellow">Tap to vote →</span>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}

            {activePos && (
              <>
                <div style={{ display: "flex", alignItems: "center", gap: ".75rem", marginBottom: "1.5rem" }}>
                  <button className="btn btn-ghost btn-sm" onClick={() => { setActivePos(null); setSubmitError(""); }}>← Back</button>
                  <div>
                    <div className="page-title" style={{ margin: 0 }}>{activePos.name}</div>
                    <div style={{ color: G.muted, fontSize: ".78rem" }}>Select one candidate, then confirm</div>
                  </div>
                </div>
                <div className="candidates-grid">
                  {posCandidates.map(c => {
                    const sel = selections[String(activePos.id)] === String(c.id);
                    return (
                      <div key={c.id} className={`cand-card ${sel ? "selected" : ""}`}
                        onClick={() => setSelections(prev => ({ ...prev, [String(activePos.id)]: String(c.id) }))}>
                        <div className="cand-avatar" style={{ background: c.color }}>{c.initials}</div>
                        <div className="cand-name">{c.name}</div>
                        <div className="cand-manifesto">{c.manifesto || "No manifesto provided."}</div>
                        {sel && <div style={{ marginTop: "1rem" }}><span className="badge badge-yellow">✓ Selected</span></div>}
                      </div>
                    );
                  })}
                  {posCandidates.length === 0 && <div className="empty">No candidates for this position.</div>}
                </div>
                {selections[String(activePos.id)] && !votedPositions.has(String(activePos.id)) && (
                  <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
                    <button className="btn btn-primary" style={{ fontSize: "1rem", padding: ".75rem 2rem" }} onClick={() => setConfirm(true)}>
                      <Icon name="ballot" size={16} /> Submit Vote
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>

      {confirmModal && activePos && (
        <div className="modal-backdrop">
          <div className="modal" style={{ maxWidth: 360, textAlign: "center" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: ".75rem" }}>🗳</div>
            <div className="modal-title" style={{ textAlign: "center" }}>Confirm Your Vote</div>
            {submitError && <div className="alert alert-red">{submitError}</div>}
            <p style={{ color: G.muted, fontSize: ".85rem", marginBottom: "1.25rem" }}>
              Voting for <strong style={{ color: G.text }}>{candidates.find(c => String(c.id) === selections[String(activePos.id)])?.name}</strong> as <strong style={{ color: G.accent }}>{activePos.name}</strong>. This cannot be changed.
            </p>
            <div className="modal-actions" style={{ justifyContent: "center" }}>
              <button className="btn btn-ghost" onClick={() => setConfirm(false)} disabled={submitting}>Cancel</button>
              <button className="btn btn-primary" onClick={submitVote} disabled={submitting}>
                {submitting ? <span className="spinner" /> : "Confirm Vote"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
