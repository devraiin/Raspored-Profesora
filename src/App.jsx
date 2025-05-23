import React, {useEffect, useMemo, useState} from "react";
import {
    Box,
    AppBar,
    Toolbar,
    Typography,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    CssBaseline,
    Button,
    Menu,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    useMediaQuery,
} from "@mui/material";
import { styled, ThemeProvider, createTheme } from "@mui/material/styles";
import SettingsIcon from "@mui/icons-material/Settings";
import Brightness5Icon from "@mui/icons-material/Brightness5";
import NightsStayIcon from "@mui/icons-material/NightsStay";
import smjenaA from "./raspored_profesora_smjena_a.json";
import smjenaB from "./raspored_profesora_smjena_b.json";
import GitHubIcon from "@mui/icons-material/GitHub";

const idDana = {
    pon: "Ponedjeljak",
    uto: "Utorak",
    sri: "Srijeda",
    cet: "Četvrtak",
    pet: "Petak",
};

// const smjenaCasovi = {
//     prvaSmjena: [
//         { start: "07:45", end: "08:30" },
//         { start: "08:35", end: "09:20" },
//         { start: "09:25", end: "10:10" },
//         { start: "10:25", end: "11:10" },
//         { start: "11:15", end: "12:00" },
//         { start: "12:05", end: "12:50" },
//         { start: "12:55", end: "13:40" }
//     ],
//     drugaSmjena: [
//         { start: "13:45", end: "14:30" },
//         { start: "14:35", end: "15:20" },
//         { start: "15:25", end: "16:10" },
//         { start: "16:25", end: "17:10" },
//         { start: "17:15", end: "18:00" },
//         { start: "18:05", end: "18:50" },
//         { start: "18:55", end: "19:40" }
//     ]
// };

const darkModeDugme = styled("div")(({ theme, darkMode }) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    backgroundColor: darkMode ? theme.palette.warning.light : theme.palette.primary.light,
    cursor: "pointer",
    transition: "all 0.5s ease, transform 0.2s ease",
    boxShadow: darkMode
        ? "0px 0px 20px 5px rgba(255,196,0,0.8)"
        : "0px 0px 20px 5px rgba(0,123,255,0.8)",
    "&:hover": {
        transform: "scale(1.2)",
    },
    "&:active": {
        transform: "scale(0.9)",
    },
}));



export default function RasporedProfesora() {
    const [darkMode, setDarkMode] = useState(() => {
        const saved = localStorage.getItem("darkMode");
        return saved ? JSON.parse(saved) : false;
    });

    const [filterRazred, setFilterRazred] = useState(() => {
        return localStorage.getItem("filterRazred") || "";
    });

    const [filterUcionica, setFilterUcionica] = useState(() => {
        return localStorage.getItem("filterUcionica") || "";
    });

    const [selektovanaSmjena, setselektovanaSmjena] = useState(() => {
        return localStorage.getItem("selektovanaSmjena") || "smjenaA";
    }); // TODO: ukloni ovo kasnije jer sve kvari kada se ukloni sada

    const [selektovaniProfesor, setselektovaniProfesor] = useState(() => {
        const saved = localStorage.getItem("selektovaniProfesor");
        return saved
            ? JSON.parse(saved)
            : (selektovanaSmjena === "smjenaA" ? smjenaA[0] : smjenaB[0]);
    });


    const [filterDialogOpen, setFilterDialogOpen] = useState(false);
    const [rawJsonDialogOpen, setRawJsonDialogOpen] = useState(false);
    // const [sljedeciCas, setSljedeciCas] = useState(null);
    // const [doSljedecegCasa, setdoSljedecegCasa] = useState(""); // nije koristeno


    const handleRawJsonDialogToggle = () => {
        setRawJsonDialogOpen((prev) => !prev);
    };

    const theme = useMemo(() => createTheme({
        palette: { mode: darkMode ? "dark" : "light" },
        custom: {
            smjenaA: darkMode ? "#276678" : "#81D4FA",
            smjenaB: darkMode ? "#F4A261" : "#FFF59D"
        },
    }));

    useEffect(() => {
        localStorage.setItem("darkMode", JSON.stringify(darkMode));
    }, [darkMode]);

    useEffect(() => {
        localStorage.setItem("selektovaniProfesor", JSON.stringify(selektovaniProfesor));
    }, [selektovaniProfesor]);

    useEffect(() => {
        localStorage.setItem("filterRazred", filterRazred);
    }, [filterRazred]);

    useEffect(() => {
        localStorage.setItem("filterUcionica", filterUcionica);
    }, [filterUcionica]);

    useEffect(() => {
        localStorage.setItem("selektovanaSmjena", selektovanaSmjena);
    }, [selektovanaSmjena]);

    function getTrenutnaSmjena() {
        const danas = new Date();

        const godina = danas.getFullYear();
        const prviSeptembar = new Date(godina, 8, 1);

        if (danas < prviSeptembar) {
            prviSeptembar.setFullYear(godina - 1);
        }

        const razlikaUDanima = Math.floor((danas - prviSeptembar) / (1000 * 60 * 60 * 24));

        const brojSedmica = Math.floor(razlikaUDanima / 7);
        const smjenaA = brojSedmica % 2 === 0;

        return smjenaA ? "smjenaA" : "smjenaB";
    }

    // const izracunajSljedeciCas = (professor) => {
    //     if (!professor) {
    //         setSljedeciCas(null);
    //         setdoSljedecegCasa("");
    //         return;
    //     }
    //
    //     const infoProfesora = trenutniRaspored.find((p) => p.ime === professor.ime);
    //     if (!infoProfesora) {
    //         setSljedeciCas(null);
    //         setdoSljedecegCasa("");
    //         return;
    //     }
    //
    //     const selekcijaSmjene = localStorage.getItem("selektovanaSmjena") || "prvaSmjena";
    //     const smjenaCasoviList = smjenaCasovi[selekcijaSmjene];
    //
    //     const danas = new Date();
    //     const danasIndex = danas.getDay();
    //     const daniSedmice = ["ned", "pon", "uto", "sri", "cet", "pet", "sub"];
    //     const danasKey = daniSedmice[danasIndex];
    //
    //     const infoSelektovanogDana = infoProfesora.dani.find((day) => day.dan === danasKey);
    //
    //     if (!infoSelektovanogDana) {
    //         setSljedeciCas(null);
    //         setdoSljedecegCasa("");
    //         return;
    //     }
    //
    //     const sadasnjica = new Date();
    //     let pronjadenNoviCas = null;
    //
    //     for (let i = 0; i < smjenaCasoviList.length; i++) {
    //         const razredKey = `cas${i + 1}razred`;
    //         const ucionicaKey = `cas${i + 1}ucionica`;
    //
    //         if (!infoSelektovanogDana[razredKey] || !infoSelektovanogDana[ucionicaKey]) {
    //             continue;
    //         }
    //
    //         const [satCasa, minutaCasa] = smjenaCasoviList[i].start.split(":").map(Number);
    //         const vrijemeCasa = new Date();
    //         vrijemeCasa.setHours(satCasa, minutaCasa, 0, 0);
    //
    //         if (vrijemeCasa > sadasnjica) {
    //             pronjadenNoviCas = {
    //                 day: danasKey,
    //                 time: smjenaCasoviList[i].start,
    //                 razred: infoSelektovanogDana[razredKey],
    //                 ucionica: infoSelektovanogDana[ucionicaKey],
    //             };
    //             break;
    //         }
    //     }
    //
    //     if (pronjadenNoviCas) {
    //         setSljedeciCas(pronjadenNoviCas);
    //
    //         const [nextsatCasa, nextminutaCasa] = pronjadenNoviCas.time.split(":").map(Number);
    //         const nextvrijemeCasa = new Date();
    //         nextvrijemeCasa.setHours(nextsatCasa, nextminutaCasa, 0, 0);
    //
    //         const razlikaVremena = Math.max(0, Math.floor((nextvrijemeCasa - sadasnjica) / 1000));
    //         const satiOstalo = Math.floor(razlikaVremena / 3600);
    //         const minutaOstalo = Math.floor((razlikaVremena % 3600) / 60);
    //         const sekundiOstalo = razlikaVremena % 60;
    //
    //         const formatiranoVrijeme = `${satiOstalo.toString().padStart(2, "0")}:${minutaOstalo
    //             .toString()
    //             .padStart(2, "0")}:${sekundiOstalo.toString().padStart(2, "0")}`;
    //         setdoSljedecegCasa(formatiranoVrijeme);
    //     } else {
    //         setSljedeciCas(null);
    //         setdoSljedecegCasa("");
    //     }
    // };

    // useEffect(() => {
    //     if (!sljedeciCas) return;
    //
    //     const interval = setInterval(() => {
    //         const sadasnjica = new Date();
    //         const nextvrijemeCasa = new Date();
    //         const [hours, minutes] = sljedeciCas.time.split(":").map(Number);
    //
    //         nextvrijemeCasa.setHours(hours, minutes, 0, 0);
    //
    //         const razlikaVremena = Math.max(0, Math.floor((nextvrijemeCasa - sadasnjica) / 1000)); // duplikat jer nije radilo 16/5/25 - amar
    //
    //         const satiOstalo = Math.floor(razlikaVremena / 3600);
    //         const minutaOstalo = Math.floor((razlikaVremena % 3600) / 60);
    //         const sekundiOstalo = razlikaVremena % 60;
    //
    //         const formatiranoVrijeme = `${satiOstalo.toString().padStart(2, "0")}:${minutaOstalo
    //             .toString()
    //             .padStart(2, "0")}:${sekundiOstalo.toString().padStart(2, "0")}`;
    //
    //         setdoSljedecegCasa(formatiranoVrijeme);
    //     }, 1000);
    //
    //     return () => clearInterval(interval);
    // }, [sljedeciCas]);

    // useEffect(() => {
    //     izracunajSljedeciCas(selektovaniProfesor);
    // }, [selektovaniProfesor, selektovanaSmjena]);

    const akoJeMaliEkran = useMediaQuery(theme.breakpoints.down("sm"));


    // const handleSettingsClick = (event) => {
    //     setSettingsMenuAnchor(event.currentTarget);
    // };
    //
    // const handleSettingsClose = () => {
    //     setSettingsMenuAnchor(null);
    // };

    const handleFilterDialogToggle = () => {
        setFilterDialogOpen((prev) => !prev);
    };

    const normalizeName = (name) => {
        const parts = name.split(" ");
        return parts.sort().join(" ").toLowerCase();
    };

    const kombinovaniProfesori = useMemo(() => {
        const sviProfesori = [...smjenaA, ...smjenaB];

        const jedinstveniProfesori = [];
        const dodatiProfesori = new Set();

        sviProfesori.forEach((prof) => {
            const normalized = normalizeName(prof.ime);
            if (!dodatiProfesori.has(normalized)) {
                dodatiProfesori.add(normalized);
                jedinstveniProfesori.push(prof);
            }
        });

        return jedinstveniProfesori;
    }, [smjenaA, smjenaB]);


    const sortiraniProfesori = useMemo(() => {
        return [...kombinovaniProfesori].sort((a, b) =>
            a.ime.localeCompare(b.ime, "hr", { sensitivity: "base" })
        );
    }, [kombinovaniProfesori]);



    const availableRazredi = selektovaniProfesor
        ? Array.from(
            new Set(
                selektovaniProfesor.dani.flatMap((day) =>
                    Object.keys(day)
                        .filter((key) => key.includes("razred"))
                        .map((key) => day[key])
                ).filter(Boolean)
            )
        )
        : [];

    const availableUcionice = selektovaniProfesor
        ? Array.from(
            new Set(
                selektovaniProfesor.dani.flatMap((day) =>
                    Object.keys(day)
                        .filter((key) => key.includes("ucionica"))
                        .map((key) => day[key])
                ).filter(Boolean)
            )
        )
        : [];

    // const filterovaniDani = selektovaniProfesor?.dani.map((day) => {
    //     const filterovaniRazredi = {};
    //     Object.keys(day).forEach((key) => {
    //         if (key.startsWith("cas")) {
    //             const index = key.match(/\d+/)[0];
    //             const razred = day[`cas${index}razred`];
    //             const ucionica = day[`cas${index}ucionica`];
    //             if (
    //                 (!filterRazred || (razred && razred.includes(filterRazred))) &&
    //                 (!filterUcionica || (ucionica && ucionica.includes(filterUcionica)))
    //             ) {
    //                 filterovaniRazredi[`cas${index}razred`] = razred;
    //                 filterovaniRazredi[`cas${index}ucionica`] = ucionica;
    //             } else {
    //                 filterovaniRazredi[`cas${index}razred`] = null;
    //                 filterovaniRazredi[`cas${index}ucionica`] = null;
    //             }
    //         }
    //     });
    //     return { ...day, ...filterovaniRazredi };
    // });

    return (
        <ThemeProvider theme={theme}>
            <Box paddingTop={akoJeMaliEkran ? "10px" : "20px"} fontSize={akoJeMaliEkran ? "12px" : "inherit"}>
                <CssBaseline />
                <AppBar position="static">
                    <Toolbar>
                        <Typography variant={akoJeMaliEkran ? "body1" : "h6"} sx={{ flexGrow: 1 }}>
                            Raspored profesora
                        </Typography>
                        {/*^^ promjeni kasnije - 18/5/25 ruhullah */}

                        <Box
                            component={darkModeDugme}
                            darkMode={darkMode}
                            onClick={() => setDarkMode((prevMode) => !prevMode)}
                        >
                            {darkMode ? <Brightness5Icon /> : <NightsStayIcon />}
                        </Box>

                        {/*<IconButton*/}
                        {/*    onClick={(e) => setSettingsMenuAnchor(e.currentTarget)}*/}
                        {/*    sx={{ color: "inherit", ml: 2 }}*/}
                        {/*>*/}
                        {/*    <SettingsIcon />*/}
                        {/*</IconButton>*/}

                        {/*<Menu*/}
                        {/*    anchorEl={settingsMenuAnchor}*/}
                        {/*    open={Boolean(settingsMenuAnchor)}*/}
                        {/*    onClose={() => setSettingsMenuAnchor(null)}*/}
                        {/*>*/}
                        {/*    <MenuItem*/}
                        {/*        onClick={() => {*/}
                        {/*            setselektovanaSmjena("smjenaA");*/}
                        {/*            setTrenutniRaspored(smjenaA);*/}
                        {/*            setSettingsMenuAnchor(null);*/}
                        {/*            handleShiftChange("smjenaA");*/}
                        {/*        }}*/}
                        {/*        selected={selektovanaSmjena === "smjenaA"}*/}
                        {/*        sx={{*/}
                        {/*            backgroundColor: selektovanaSmjena === "smjenaA" ? "primary.main" : "inherit",*/}
                        {/*            color: selektovanaSmjena === "smjenaA" ? "white" : "inherit",*/}
                        {/*            "&:hover": {*/}
                        {/*                backgroundColor: selektovanaSmjena === "smjenaA" ? "primary.dark" : "grey.050",*/}
                        {/*            },*/}
                        {/*        }}*/}
                        {/*    >*/}
                        {/*        Smjena A*/}
                        {/*    </MenuItem>*/}
                        {/*    <MenuItem*/}
                        {/*        onClick={() => {*/}
                        {/*            setselektovanaSmjena("smjenaB");*/}
                        {/*            setTrenutniRaspored(smjenaB);*/}
                        {/*            setSettingsMenuAnchor(null);*/}
                        {/*            handleShiftChange("smjenaB");*/}

                        {/*        }}*/}
                        {/*        selected={selektovanaSmjena === "smjenaB"}*/}
                        {/*        sx={{*/}
                        {/*            backgroundColor: selektovanaSmjena === "smjenaB" ? "primary.main" : "inherit",*/}
                        {/*            color: selektovanaSmjena === "smjenaB" ? "white" : "inherit",*/}
                        {/*            "&:hover": {*/}
                        {/*                backgroundColor: selektovanaSmjena === "smjenaB" ? "primary.dark" : "grey.050",*/}
                        {/*            },*/}
                        {/*        }}*/}
                        {/*    >*/}
                        {/*        Smjena B*/}
                        {/*    </MenuItem>*/}
                        {/*</Menu>*/}

                    </Toolbar>
                </AppBar>

                <Box mt={4} mx={2}>
                    <FormControl fullWidth>
                        <InputLabel id="profesor-select-label">Profesor</InputLabel>
                        <Select
                            labelId="profesor-select-label"
                            value={selektovaniProfesor?.ime || ""}
                            onChange={(e) => {
                                const selected = sortiraniProfesori.find((prof) => prof.ime === e.target.value);
                                setselektovaniProfesor(selected);
                            }}
                        >
                            {sortiraniProfesori.map((profesor, index) => (
                                <MenuItem key={index} value={profesor.ime}>
                                    {profesor.ime}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <Button
                        variant="contained"
                        onClick={handleFilterDialogToggle}
                        sx={{ mt: 2, backgroundColor: theme.palette.primary.main }}
                    >
                        Filteri
                    </Button>

                    <Dialog open={filterDialogOpen} onClose={handleFilterDialogToggle}>
                        <DialogTitle>Filteri</DialogTitle>
                        <DialogContent
                            sx={{
                                minWidth: '400px', 
                                minHeight: '200px', 
                                maxWidth: '500px', 
                                padding: '16px',
                            }}
                        >
                            <FormControl fullWidth margin="normal">
                                <InputLabel id="select-razred-label">Filtriraj po razredu</InputLabel>
                                <Select
                                    labelId="select-razred-label"
                                    value={filterRazred}
                                    onChange={(e) => setFilterRazred(e.target.value)}
                                >
                                    <MenuItem value="">Svi razredi</MenuItem>
                                    {availableRazredi.map((razred, index) => (
                                        <MenuItem key={index} value={razred}>
                                            {razred}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl fullWidth margin="normal">
                                <InputLabel id="select-ucionica-label">Filtriraj po učionici</InputLabel>
                                <Select
                                    labelId="select-ucionica-label"
                                    value={filterUcionica}
                                    onChange={(e) => setFilterUcionica(e.target.value)}
                                >
                                    <MenuItem value="">Sve učionice</MenuItem>
                                    {availableUcionice.map((ucionica, index) => (
                                        <MenuItem key={index} value={ucionica}>
                                            {ucionica}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleFilterDialogToggle}>Zatvori</Button>
                        </DialogActions>
                    </Dialog>

                    <Dialog open={rawJsonDialogOpen} onClose={handleRawJsonDialogToggle}>
                        <DialogTitle>RAW JSON</DialogTitle>
                        <DialogContent>
                            {selektovaniProfesor ? (
                                <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                {JSON.stringify(selektovaniProfesor, null, 2)}
            </pre>
                            ) : (
                                <Typography>Niste odabrali profesora. Molimo izaberite jednog.</Typography>
                            )}
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleRawJsonDialogToggle}>Zatvori</Button>
                        </DialogActions>
                    </Dialog>


                    {selektovaniProfesor && (
                        <TableContainer component={Paper} sx={{ mt: 3 }}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Dan</TableCell>
                                        {[...Array(7)].map((_, i) => (
                                            <TableCell key={i} align="center">{`Čas ${i + 1}`}</TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {Object.entries(idDana).map(([danKey, danName]) => (
                                        <TableRow key={danKey}>
                                            <TableCell style={{ fontWeight: "bold" }}>
                                                {danName}
                                            </TableCell>
                                            {Array.from({ length: 7 }).map((_, index) => {
                                                const casKey = `cas${index + 1}`;

                                                const smjenaAData = smjenaA.find(
                                                    (prof) => normalizeName(prof.ime) === normalizeName(selektovaniProfesor?.ime)
                                                )?.dani.find((dan) => dan.dan === danKey);

                                                const smjenaBData = smjenaB.find(
                                                    (prof) => normalizeName(prof.ime) === normalizeName(selektovaniProfesor?.ime)
                                                )?.dani.find((dan) => dan.dan === danKey);

                                                const razredA = smjenaAData ? smjenaAData[`${casKey}razred`] : null;
                                                const ucionicaA = smjenaAData ? smjenaAData[`${casKey}ucionica`] : null;

                                                const razredB = smjenaBData ? smjenaBData[`${casKey}razred`] : null;
                                                const ucionicaB = smjenaBData ? smjenaBData[`${casKey}ucionica`] : null;

                                                const prikazA = razredA ? `${razredA} ${ucionicaA ? `(${ucionicaA})` : ""}` : null;
                                                const prikazB = razredB ? `${razredB} ${ucionicaB ? `(${ucionicaB})` : ""}` : null;

                                                return (
                                                    <TableCell
                                                        key={casKey}
                                                        align="center"
                                                        style={{
                                                            backgroundColor: razredA ? theme.custom.smjenaA : razredB ? theme.custom.smjenaB : "inherit",
                                                            color: theme.palette.mode === "light" ? "#000" : "white",
                                                        }}
                                                    >
                                                        {prikazA && prikazB
                                                            ? `${prikazA} / ${prikazB}`
                                                            : prikazA || prikazB || "-"}
                                                    </TableCell>
                                                );
                                            })}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            height: "15vh",
                            textAlign: "center",
                        }}
                    >
                        {/*{sljedeciCas ? (*/}
                        {/*    <Typography variant="h7">*/}
                        {/*        Sljedeći čas: {idDana[sljedeciCas.day]} u {sljedeciCas.time}, učionica: {sljedeciCas.ucionica} <br />*/}
                        {/*        Vrijeme do početka: {doSljedecegCasa}*/}
                        {/*    </Typography>*/}
                        {/*) : (*/}
                        {/*    <Typography variant="h7">Nema više časova za danas.</Typography>*/}
                        {/*)}*/}
                    </Box>

                    <Box sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}>
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                marginRight: 2,
                            }}
                        >
                            <Box
                                sx={{
                                    width: 20,
                                    height: 20,
                                    backgroundColor: theme.custom.smjenaA,
                                    marginRight: 1,
                                    border: "1px solid black",
                                }}
                            />
                            <Typography variant="body2">Smjena A</Typography>
                        </Box>

                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                            }}
                        >
                            <Box
                                sx={{
                                    width: 20,
                                    height: 20,
                                    backgroundColor: theme.custom.smjenaB,
                                    marginRight: 1,
                                    border: "1px solid black",
                                }}
                            />
                            <Typography variant="body2">Smjena B</Typography>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </ThemeProvider>
    );
}
