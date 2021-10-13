
import Planet, { SourceryPlanetData } from "./planet";

const functions = require('firebase-functions');

const swisseph = require('swisseph');

const PI180 = 180.0 / Math.PI;
const PI2 = 2.0 * Math.PI;
const NUMBER_PLANET = 10;


const NAME_PLANET = [
    "Surya", "Chandra", "Budha", "Shukra", "Mangal", "Guru", "Shani", "Uranus", "Neptune", "Pluto"
];

let kyear: any, kmon: any, kday: any
const planetsR: any = []
const naks_grha = [0, 1, 2, 3, 4, 5, 6, 7, 8, 0, 1, 2, 3, 4, 5, 6, 7, 8, 0, 1, 2, 3, 4, 5, 6, 7, 8];
let nakID: any, nakGraha: any
const DEG_TIME = (360 / 27) * 60


export const horoscope = functions.https.onRequest(
    async (request: any, response: any) => {


        response.set("Access-Control-Allow-Origin", "*");
        response.set("Access-Control-Allow-Credentials", "true"); // vital

        if (request.method === "OPTIONS") {
            // Send response to OPTIONS requests
            response.set("Access-Control-Allow-Methods", "GET");
            response.set("Access-Control-Allow-Headers", "Content-Type");
            response.set("Access-Control-Max-Age", "3600");
            //console.log("Start the execution-2");
            response.status(204).send("");
        } else {

            const latR = request.body.lattitude
            const lonR = request.body.longitude

            const day = request.body.day    //d.getDate();
            const mon = request.body.month //   d.getMonth() + 1;
            const year = request.body.year //d.getFullYear();
            const hr = request.body.hours   //d.getHours();
            const mn = request.body.minutes
            const offset = request.body.offset

            const data = {
                lattitude: latR,
                longitude: lonR,
                day: day,
                year: year,
                month: mon,
                hours: hr,
                minutes: mn,
                second: 0,
                offset: offset,
                calcOpt: "02"
            }

            response.send(genhoroscope(data))

        }
    })


export function genhoroscope(birthData: any) {

    /** Hilfswert 180/Pi. */
    planetsR[0] = RFromD(15.0 + 30.0 * 4);

    planetsR[1] = RFromD(15.0 + 30.0 * 3);

    planetsR[2] = RFromD(15.0 + 30.0 * 2);
    planetsR[3] = RFromD(15.0 + 30.0 * 6);
    planetsR[4] = RFromD(15.0 + 30.0 * 0);
    planetsR[5] = RFromD(15.0 + 30.0 * 8);
    planetsR[6] = RFromD(15.0 + 30.0 * 9);
    planetsR[7] = RFromD(15.0 + 30.0 * 10);
    planetsR[8] = RFromD(15.0 + 30.0 * 11);
    planetsR[9] = RFromD(15.0 + 30.0 * 7);

    let Array = []
    Array = [
        [358.47584, 35999.0498, -0.00015, 0.016751, -0.41E-4, 0, 1.00000013, 101.22083, 1.71918, 0.00045, 0, 0, 0, 0, 0, 0],
        [102.27938, 149472.515, 0, 0.205614, 0.2E-4, 0, 0.387098, 28.75375, 0.37028, 0.00012, 47.14594, 1.1852, 0.00017, 7.00288, 0.00186, -0.1E-4], // Mercury
        [212.60322, 58517.8039, 0.00129, 0.00682, -0.4E-4, 0, 0.723332, 54.38419, 0.50819, -0.00139, 75.77965, 0.89985, 0.00041, 3.39363, 0.001, 0], // Venus
        [319.5293, 19139.8585, 0.18E-3, 0.09331, 0.9E-4, 0, 1.52369, 285.43176, 1.06977, 0.13E-3, 48.78644, 0.77099, 0, 1.85033, -0.68E-3, 0.1E-4],  // Mars
        [225.32833, 3034.69202, 0.00072, 0.04833, 0.00016, 0, 5.202561, 273.27754, 0.59943, 0.0007, 99.44338, 1.01053, 0.00035, 1.30874, -0.005696, 0], // Jupiter, - Fehler
        [175.46622, 1221.55147, -0.0005, 0.05589, -0.00035, 0, 9.55475, 338.30777, 1.08522, 0.00098, 112.79039, 0.873195, -0.00015, 2.49252, -0.00392, -0.2E-4], // Saturn
        [72.64882, 428.37911, 0.8E-4, 0.046344, -0.3E-4, 0, 19.21814, 98.07155, 0.98577, -0.00107, 73.4771, 0.49867, 0.00131, 0.77246, 0.00063, 0.4E-4], // Uranus
        [37.73067, 218.46134, -0.7E-4, 0.008997, 0, 0, 30.10957, 276.04597, 0.32564, 0.00014, 130.68136, 1.09894, 0.000249, 1.77924, -0.00954, 0],   // Neptune
        [229.94722, 144.91306, 0, 0.24864, 0, 0, 39.51774, 113.52139, 0, 0, 108.95444, 1.39601, 0.00031, 17.14678, 0, 0]                             // Pluto

    ]

    let m, // mean anomaly in radians, then Radiant von node
        e, // eccentricity
        au, // semi major axis
        rv, // actual radius vector
        // rv1=0,  // rv of sun
        ea, // eccentric anomaly
        inc, // Inclination
        s, // Hilfswert zum Lesen der Werte aus dem Array
        a, // Hilfswert, ein Winkel
        v, b, // Hilfswerte
        c, c1 = 0, d, // heliozentrische Long und Lat in Radians, Long of sun
        x, x1 = 0, y, y1 = 0, z, z1 = 0; // actual planar coordinates, of sun

    const latR = RFromD(birthData.lattitude)
    const lonR = RFromD(birthData.longitude * (-1))

    const day = birthData.day    //d.getDate();
    const mon = birthData.month //   d.getMonth() + 1;
    const year = birthData.year //d.getFullYear();
    let hr = birthData.hours   //d.getHours();

    const calcOpt = birthData.calcOpt



    hr += birthData.minutes / 60 //d.getMinutes() / 60;
    const tzone = birthData.offset / 60

    const jd0 = mdy2julian(mon, day, year);
    const jdut = jd0 + (hr - tzone) / 24;


    const dt: any = dTime(jdut);


    const jd = jdut + dt / 24;

    const julianCenturies = (jd - 2415020) / 36525.0

    let worldTime = hr - tzone
    //console.log("worldTime before:***" + worldTime);

    if (worldTime < 0) {
        worldTime = 24 + worldTime
    }
    //console.log("worldTime:****" + worldTime);
    //console.log("jd:" + jd);

    for (let i = 1; i < NUMBER_PLANET; i++) { // loop für 9 Planeten

        // Mean anomaly (in radians) einlesen.
        s = Array[i - 1][0] + (Array[i - 1][1] + Array[i - 1][2] * julianCenturies) * julianCenturies;
        m = RFromD(Mod360(s));

        // console.log("s:" + s);
        // console.log(Mod360(s));
        // console.log("m:" + m);
        // eccentricity einlesen
        e = Array[i - 1][3] + (Array[i - 1][4] + Array[i - 1][5] * julianCenturies) * julianCenturies;
        //console.log("e:" + e);
        // solve Kepler's Equation for eccentric anomaly by iteration
        ea = m; // Startwert der Iteration
        for (let j = 1; j <= 5; j++) ea = m + e * Math.sin(ea);
        //console.log("ea:" + ea);
        // calculate Radius vector
        au = Array[i - 1][6];
        //console.log("au:" + au);
        rv = RFromD(au) * (1.0 - e * Math.cos(ea));
        //console.log("rv:" + rv);

        // calculate true anomaly
        let xy = RecToPol(au * (Math.cos(ea) - e),
            au * Math.sin(ea) * Math.sqrt(1.0 - e * e));
        //console.log("xy:" + xy.x);
        //console.log("xy:" + xy.y);
        s = Array[i - 1][7] + (Array[i - 1][8] + Array[i - 1][9] * julianCenturies) * julianCenturies; // argument of the perihelion
        //console.log("s1:" + s);
        a = DFromR(xy.y) + s;
        //console.log("a1:" + a);
        s = Array[i - 1][10] + (Array[i - 1][11] + Array[i - 1][12] * julianCenturies) * julianCenturies; // ascending node
        //console.log("s2:" + s);
        v = Mod360(a + s); // Grad von Pol+ Perhelion + node
        //console.log("v1:" + v);
        b = RFromD(v); // Radiant von Pol+ Perhelion + node
        //console.log("b1:" + b);
        m = RFromD(s); // Radiant von node
        //console.log("m:" + m);

        // reduce to ecliptic
        s = Array[i - 1][13] + (Array[i - 1][14] + Array[i - 1][15] * julianCenturies) * julianCenturies;
        //console.log("s2:" + s);
        inc = RFromD(s);
        //console.log("in:" + inc);
        a = Math.atan(Math.cos(inc) * Math.tan(b - m));
        //console.log("a3:" + a);
        if (a < 0) a += Math.PI;
        // a = CalcUtil.DFromR(a+m);
        // if (Math.abs(v-a)>10.0 ) a -= 180;
        a = a + m;
        //console.log("a4:" + a);
        if (Math.abs(b - a) > RFromD(10.0)) a -= Math.PI;
        // c = CalcUtil.RFromD(CalcUtil.Mod360(a));
        c = Mod2PI(a);
        //console.log("c4:" + c);
        d = Math.atan(Math.sin(c - m) * Math.tan(inc));
        //console.log("d4:" + d);
        // check for retrogade motion (circular orbit assumed)
        if (i === 1) {
            //rv1 = rv;
            c1 = c;
        } else {
            /* What is that for
             x = ( Math.sqrt(rv)+Math.sqrt(rv1) )* Math.sqrt(rv1) * Math.sqrt(rv) /
                 (rv*Math.sqrt(rv) + rv1*Math.sqrt(rv1));
             x = x - Math.cos(c1 - c);
             if (x < 0) retrogenic = true;
             else retrogenic = false;
            */
        }

        // transform helio to recuangular (x,y,z)
        x = rv * Math.cos(d) * Math.cos(c);
        y = rv * Math.cos(d) * Math.sin(c);
        z = rv * Math.sin(d);
        //console.log("x:" + x);
        //console.log("y:" + y);
        //console.log("z:" + z);
        // transform helio to geocentrix x/y/z
        if (i === 1) {
            x1 = x;
            y1 = y;
            z1 = z;
        } else {
            x = x - x1;
            y = y - y1;
            z = z - z1;
        }

        // transform geo x/y/z to geo polar (longitude)
        xy = RecToPol(x, y);
        //console.log("xy1:" + xy.x);
        //console.log("xy2:" + xy.y);

        if (i === 1) {
            planetsR[0] = Mod2PI(c1 + Math.PI);
            //console.log("Mod2PI(c1 + Math.PI)xy1:" + Mod2PI(c1 + Math.PI)); 
        }
        else {
            planetsR[i] = xy.y; //console.log("planetsR[i] = xy.y" + planetsR[i]);
        }
        /*
        if (i==1) c = CalcUtil.Mod2PI(c1+Math.PI);
        else c = xy.y;
        c[i] = c;
        
        xy = CalcUtil.RecToPol(xy.x,z);
        a = xy.y;
        if (a > 0.35) a -= CalcUtil.PI2;
        d[i] = a;
        */
    }
    const calyan = calcayan(jd)

    //console.log("calyan: " + calyan)
    //calculateMoon()
    //Start*************
    let D // Mean elongation of Moo from Sun
    let ML // Compute Moon's perturbations longitide
    const siderealOffset = 0.0
    const M = 3600.0; // Divisor
    //     T2; // julian centuries squared
    const T2 = julianCenturies * julianCenturies;
    //     LL, // Compute mean lunar longitude

    const LL = 973563.0 + 1732564379.0 * julianCenturies - 4.0 * T2; // Compute mean lunar longitude
    //     G,  // Sun's mean longitude of perigee
    const G = 1012395.0 + 6189.0 * julianCenturies;              // Sun's mean longitude of perigee
    //     N,  // Compute mean lunar node
    const N = 933060.0 - 6962911.0 * julianCenturies + 7.5 * T2;     // Compute mean lunar node in seconds, convert to degree
    //     G1, // Mean longitude of lunar perigee
    const G1 = 1203586.0 + 14648523.0 * julianCenturies - 37.0 * T2; // Mean longitude of lunar perigee
    D = 1262655.0 + 1602961611.0 * julianCenturies - 5.0 * T2; // Mean elongation of Moon from Sun

    //console.log("julianCenturies" + julianCenturies);
    //console.log("T2:" + T2);
    //console.log("LL:" + LL);
    //console.log("G:" + G);
    //console.log("N:" + N);
    //console.log("G1:" + G1);


    // Some auxiliary angles
    //     L, L1, T1, Y, // Some auxiliary angles
    const L = (LL - G1) / M;
    const L1 = ((LL - D) - G) / M;
    const T1 = (LL - N) / M;           // called F
    D = D / M;
    const Y = 2.0 * D;
    //console.log("L1:" + L);
    //console.log("L1:" + L1);
    //console.log("T1:" + T1);
    //console.log("D" + D);
    //console.log("Y" + Y);
    // Compute Moon's perturbations.
    ML = 22639.6 * RSinD(L) - 4586.4 * RSinD(L - Y) + 2369.9 * RSinD(Y) +
        769.0 * RSinD(2.0 * L) - 669.0 * RSinD(L1) - 411.6 * RSinD(2.0 * T1) -
        212.0 * RSinD(2.0 * L - Y) - 206.0 * RSinD(L + L1 - Y);
    // ML = 22639.6 * RSinD(L)  //- 4586.4 * RSinD(L - Y) + 2369.9 * RSinD(Y) +
    // //   769.0 * RSinD(2.0 * L) - 669.0 * RSinD(L1) - 411.6 * RSinD(2.0 * T1) -
    // //   212.0 * RSinD(2.0 * L - Y) - 206.0 * RSinD(L + L1 - Y);
    //console.log("ML:" + ML);



    ML += 192.0 * RSinD(L + Y) - 165.0 * RSinD(L1 - Y) + 148.0 * RSinD(L - L1) -
        125.0 * RSinD(D) - 110.0 * RSinD(L + L1) - 55.0 * RSinD(2.0 * T1 - Y) -
        45.0 * RSinD(L + 2.0 * T1) + 40.0 * RSinD(L - 2.0 * T1);
    //console.log("ML1:" + ML);

    //console.log("ML Final:" + Mod2PI(RFromD((LL + ML) / M)))


    if (siderealOffset !== 0.0) planetsR[1] = Mod2PI(RFromD((LL + ML) / M) + siderealOffset); // Lunar longitude in radians
    else planetsR[1] = Mod2PI(RFromD((LL + ML) / M)); // Lunar longitude in radians

    //End *************

    swisseph.swe_set_ephe_path(__dirname + '/../ephe');

    const flags = swisseph.SEFLG_SPEED;
    const plandata: Array<Planet> = [];
    [
        swisseph.SE_SUN,
        swisseph.SE_MOON,
        swisseph.SE_MERCURY,
        swisseph.SE_VENUS,
        swisseph.SE_MARS,
        swisseph.SE_JUPITER,
        swisseph.SE_SATURN,
        swisseph.SE_URANUS,
        swisseph.SE_NEPTUNE,
        swisseph.SE_PLUTO,
        swisseph.SE_MEAN_NODE
    ].map(planet => {
        const pd: SourceryPlanetData = swisseph.swe_calc_ut(jd, planet, flags);
        plandata[planet] = new Planet(Planet.names[planet], pd.longitude, pd.latitude, pd.longitudeSpeed);
    });

    //text = "<table border='1' style='margin-top: 2em; margin-left: 5em' ><tr><th width='30%'> Planets  </th><th width='30%'> Rashi</th><th width='30%'>Longitude </th></tr>"
    const eclipticObliquity = RFromD(23.452294 - 0.0130125 * julianCenturies);
    const rightAscension =
        RFromD(
            Mod360(
                (6.6460656 + (2400.0513 + 2.58E-5 * julianCenturies) * julianCenturies + worldTime) * 15.0
                - DFromR(lonR)));

    y1 = - Math.cos(rightAscension)
    x1 = (Math.sin(rightAscension) * Math.cos(eclipticObliquity)) + (Math.tan(latR) * Math.sin(eclipticObliquity))
    let ascendant = Math.atan2(y1, x1);
    //console.log("New Method ascendant before***" + ascendant);
    if (ascendant < 0) {
        ascendant = ascendant + Math.PI
    } else {
        ascendant = ascendant - Math.PI
    }
    ascendant = fix360(DFromR(ascendant) + calyan)//

    //console.log(" Ascendant : " + zn[Math.floor(Math.abs(ascendant) / 30)]);

    //console.log("Calculation of Rahu & ketu begins...");

    const tmp0 = 22.460148 + 1.396042 * julianCenturies + 3.08E-4 * julianCenturies * julianCenturies
    //console.log("tmp0: " + tmp0);

    let cO = 360 * fractionReal(0.65756 - 5.376495 * julianCenturies)
    //console.log("cO: " + cO);

    if (cO < 0) {
        cO = cO + 360
    }
    //console.log("cO: " + cO);

    const dRahu4 = cO
    const rahuFinal = (dRahu4 + tmp0 + calyan) < 360 ? (dRahu4 + tmp0 + calyan) : (dRahu4 + tmp0 + calyan - 360)
    //console.log("rahuFinal: " + rahuFinal);
    //console.log(zn[Math.floor(Math.abs(rahuFinal) / 30)] + "-" + lon2dmsz(rahuFinal));


    const dKetu = (cO + 180) > 360 ? (cO + 180) - 360 : (cO + 180)
    const ketuFinal = (dKetu + tmp0 + calyan) < 360 ? (dKetu + tmp0 + calyan) : (dKetu + tmp0 + calyan - 360)
    //console.log("ketuFinal: " + ketuFinal);
    //console.log(zn[Math.floor(Math.abs(ketuFinal) / 30)] + "-" + lon2dmsz(ketuFinal));
    const planetsDet = []
    let planetHouse = 99
    let planetName: any;

    let planeteach = {
        name: "Ascendant",
        degree_360: ascendant.toFixed(2),
        zodiac_name: (Math.floor(Math.abs(fix360(ascendant)) / 30)) + 1,
        //zodiac_degree: lon2dmsz(ascendant)
        zodiac_degree: lon2d(ascendant),
        isRetroGrade: false,
        planetHouse
    }
    const ascZodiacId = planeteach.zodiac_name
    planetsDet.push(planeteach);
    // bufstr = bufstr + "\["

    for (let i = 0; i < NUMBER_PLANET; i++) {
        // bufstr = bufstr + (NAME_PLANET[i]);
        // bufstr = bufstr + (':');

        const d_360 = fix360(DFromR(planetsR[i]) + calyan)
        const z_id = (Math.floor(Math.abs(fix360(d_360)) / 30)) + 1;
        planetHouse = ascZodiacId - z_id > 0 ? (12 - ascZodiacId + z_id) + 1 : (z_id - ascZodiacId) + 1
        // //bufstr = HMStringFromR(bufstr, planetsR[i]);
        // bufstr = bufstr + lon2dmsz(d);
        // bufstr = bufstr + "; ";
        // if ((i == 2) || (i == 6)) bufstr = bufstr + '\n';

        //text = text + "<tr>"
        planetName = plandata.find((planet: Planet) => planet.name === i.toString());

        planeteach = {
            name: NAME_PLANET[i],
            degree_360: d_360.toFixed(2),
            zodiac_name: z_id,
            zodiac_degree: lon2d(d_360),
            isRetroGrade: planetName.speed < 0 ? true : false,
            planetHouse
        }

        planetsDet.push(planeteach)
    }
    planetName = plandata.find((planet: Planet) => planet.name === "10");
    planeteach = {
        name: "Rahu",
        degree_360: rahuFinal.toFixed(2),
        zodiac_name: (Math.floor(Math.abs(fix360(rahuFinal)) / 30)) + 1,
        zodiac_degree: lon2d(rahuFinal),
        isRetroGrade: planetName.speed < 0 ? true : false,
        planetHouse
    }
    planeteach.planetHouse = ascZodiacId - planeteach.zodiac_name > 0 ? (12 - ascZodiacId + planeteach.zodiac_name) + 1 : (planeteach.zodiac_name - ascZodiacId) + 1
    planetsDet.push(planeteach)

    planeteach = {
        name: "Ketu",
        degree_360: ketuFinal.toFixed(2),
        zodiac_name: (Math.floor(Math.abs(fix360(ketuFinal)) / 30)) + 1,
        zodiac_degree: lon2d(ketuFinal),
        isRetroGrade: planetName.speed < 0 ? true : false,
        planetHouse
    }
    planeteach.planetHouse = ascZodiacId - planeteach.zodiac_name > 0 ? (12 - ascZodiacId + planeteach.zodiac_name) + 1 : (planeteach.zodiac_name - ascZodiacId) + 1
    planetsDet.push(planeteach)

    const memDate = new Date();
    //const memDays = memDate.getDate().toString().length !== 1 ? memDate.getDate() : "0" + memDate.getDate()
    //console.log(memDays);
    let memID
    if (calcOpt === "01") {
        //console.log("Inside 01...");

        //console.log("Inside...Shopping calculation...");
        const memDays = memDate.getDate().toString().length !== 1 ? memDate.getDate() : "0" + memDate.getDate()
        //console.log(memDays);
        const memMonth = (memDate.getMonth() + 1).toString().length !== 1 ? memDate.getMonth() + 1 : "0" + (memDate.getMonth() + 1)
        //console.log(memMonth);
        const memYear1 = memDate.getFullYear().toString().substring(0, 2)
        //console.log(memYear1);
        const memYear2 = memDate.getFullYear().toString().substring(4, 2)
        //console.log(memYear2);
        const rndnum = Math.floor(Math.random() * 1000001) + "999999"
        //console.log(rndnum);
        const memHour = rndnum.substring(0, 2)
        //console.log(memHour);
        const memMinutes = rndnum.substring(2, 4)
        //console.log(memMinutes);
        const memSeconds = rndnum.substring(4, 6)
        //console.log(memSeconds);
        memID = memSeconds + memYear1 + memHour + memMonth + memYear2 + memMinutes + memDays

    } else {
        const memDays = memDate.getDate().toString().length !== 1 ? memDate.getDate() : "0" + memDate.getDate()
        //console.log(memDays);

        const memMonth = (memDate.getMonth() + 1).toString().length !== 1 ? memDate.getMonth() + 1 : "0" + (memDate.getMonth() + 1)
        //console.log(memMonth);
        const memYear1 = memDate.getFullYear().toString().substring(0, 2)
        //console.log(memYear1);
        const memYear2 = memDate.getFullYear().toString().substring(4, 2)
        //console.log(memYear2);
        const memHour = memDate.getHours().toString().length !== 1 ? memDate.getHours() : "0" + memDate.getHours()
        //console.log(memHour);
        const memMinutes = memDate.getMinutes().toString().length !== 1 ? memDate.getMinutes() : "0" + memDate.getMinutes()
        //console.log(memMinutes);
        const memSeconds = memDate.getSeconds().toString().length !== 1 ? memDate.getSeconds() : "0" + memDate.getSeconds()
        //console.log(memSeconds);
        memID = memSeconds + memYear1 + memHour + memMonth + memYear2 + memMinutes + memDays

    }
    // document.getElementById("inptxt").innerHTML = inputtxt;
    // document.getElementById("demo").innerHTML = text;

    // d = new Date(1967, 7, 10, 11, 30, 0, 0)

    // latR = RFromD(18.5204)
    // lonR = RFromD(-73.8567°)
    planetsDet.push({ memID: memID })
    //console.log(planetsDet[2]["degree_360"]);
    //console.log("dash_array " + dash_array.length);
    calcDasha(planetsDet[2]["degree_360"])
    //console.log("dash_array " + dash_array.length);

    //planetsDet.push(dash_array);
    //planetsDet.push({ nakId: nakID + 1, nakGraha: nakGraha + 1, maxDate: maxDate.getFullYear(), dasaCount: dash_array.length });
    planetsDet.push({ nakId: nakID + 1, nakGraha: nakGraha + 1 });
    return planetsDet

}


//Dasha Calculation

function calcDasha(moonDeg: any) {
    //console.log(moonDeg);
    const degMin = Math.floor(moonDeg)
    const totMin = degMin * 60 + (moonDeg - degMin) * 60
    //console.log(totMin);
    nakID = Math.floor(Math.abs(totMin) / DEG_TIME)
    //console.log("Nak Id" + nakID);
    nakGraha = naks_grha[nakID]
}

//------------------------------------------------------------------------------------------
// fixing the angle within 360 degrees
//------------------------------------------------------------------------------------------
function fix360(x: any) {
    let v = x;
    while (v < 0.0) v += 360.0;
    while (v > 360.0) v -= 360.0;
    return v;
}

function fractionReal(x: any) {
    //console.log("x***" + x);
    //console.log("Final X" + Math.floor(x));

    return x - Math.floor(x)
}


//-----------------------------------------------------
// Calculation ayanamsa (degrees)
//-----------------------------------------------------
function calcayan(jd: any) {
    const t = (jd - 2415020) / 36525;
    //console.log("PI value" + PI180);
    // avg node len moon
    const om = 259.183275 - 1934.142008333206 * t + 0.0020777778 * t * t + 0.0000022222222 * t * t * t;
    // avg len sun
    const ls = 279.696678 + 36000.76892 * t + 0.0003025 * t * t;
    let aya = 17.23 * Math.sin(PI180 * om) + 1.27 * Math.sin(PI180 * ls * 2) - (5025.64 + 1.11 * t) * t;
    aya = (aya - 80861.27) / 3600.0; // 84038.27 = Fagan-Bradley, 80861.27 = Lahiri

    return aya;
}

// ---------------------------------------------------------------------
// -------------------- Spzialfunktionen -------------------------------
// ---------------------------------------------------------------------

/** Liefert Sinus von Argument in Grad.
    @param d Gradargument f&uuml;r Sinus.
    @return Sinus von Argument in Grad. */
function RSinD(d: any) {
    // console.log("PI180:***" + PI180);
    // console.log("D****" + d);
    // console.log("Math.sin(d/PI180)**" + Math.sin(d / PI180));
    const p = PI180
    return Math.sin(d / p);
}



//------------------------------------------------------------------------------------------
// transalation deg logitudinal in degrees,min and sec
//------------------------------------------------------------------------------------------
function lon2d(long: any) {
    //console.log(x);
    let x = long
    let d, ss0;
    x = Math.abs(x);
    d = Math.floor(x);
    ss0 = (x - d)
    //console.log(ss0);
    d %= 30;
    //console.log(d);
    const decdeg = (d + ss0).toFixed(2);
    //console.log(decdeg);
    return decdeg;

}

//------------------------------------------------------------------------------------------
// cal date by number of date mon and year
//------------------------------------------------------------------------------------------
function mdy2julian(m: any, d: any, y: any) {

    const im = 12 * (y + 4800) + m - 3;
    let j = (2 * (im - Math.floor(im / 12) * 12) + 7 + 365 * im) / 12;
    j = Math.floor(j) + d + Math.floor(im / 48) - 32083;
    if (j > 2299171) j += Math.floor(im / 4800) - Math.floor(im / 1200) + 38;
    j -= 0.5;

    return j;
}

function dTime(jd: any) {

    const efdt = [124, 85, 62, 48, 37, 26, 16, 10, 9, 10, 11, 11, 12, 13, 15, 16, 17, 17, 13.7, 12.5, 12, 7.5, 5.7, 7.1, 7.9, 1.6, -5.4, -5.9, -2.7, 10.5, 21.2, 24, 24.3, 29.2, 33.2, 40.2, 50.5, 56.9, 65.7, 75.5];
    //let s = calData(jd);
    calData(jd);
    const dgod = kyear + (kmon - 1) / 12 + (kday - 1) / 365.25;
    const t = (jd - 2378497) / 36525; // IN centuries rejection of 1800 bc
    //t = (jd - 2415020)/36525; // in cent rejection of 1900 bc
    let dt: any
    if (dgod >= 1620 && dgod < 2010) {
        const i1 = Math.floor((dgod - 1620) / 10);
        const di = dgod - (1620 + i1 * 10);
        dt = (efdt[i1] + ((efdt[i1 + 1] - efdt[i1]) * di) / 10);
    }
    else {
        if (dgod >= 2010) dt = 25.5 * t * t - 39;
        //if (dgod >= 2010) dt = 29.949 * t * t - 56.796;
        //if (dgod < 1620) dt = 5 + 24.349 + 72.3165 * t + 29.949 * t * t;
        if (dgod >= 948 && dgod < 1620) dt = 25.5 * t * t;
        if (dgod < 948) dt = 1361.7 + 320 * t + 44.3 * t * t;
    }
    dt /= 3600;
    return dt;
}

//------------------------------------------------------------------------------------------
// cal date on calendar date
//------------------------------------------------------------------------------------------
function calData(jd: any) {

    const z1 = jd + 0.5;
    const z2 = Math.floor(z1);
    const f = z1 - z2;
    let a
    if (z2 < 2299161) {
        a = z2;
    }
    else {
        const alf = Math.floor((z2 - 1867216.25) / 36524.25);
        a = z2 + 1 + alf - Math.floor(alf / 4);
    }

    const b = a + 1524;
    const c = Math.floor((b - 122.1) / 365.25);
    const d = Math.floor(365.25 * c);
    const e = Math.floor((b - d) / 30.6001);

    const days = b - d - Math.floor(30.6001 * e) + f;
    kday = Math.floor(days);

    if (e < 13.5) kmon = e - 1;
    else kmon = e - 13;

    if (kmon > 2.5) kyear = c - 4716;
    if (kmon < 2.5) kyear = c - 4715;

    const hh1 = (days - kday) * 24;
    const khr = Math.floor(hh1);
    let kmin = hh1 - khr;
    let ksek = kmin * 60;
    kmin = Math.floor(ksek);
    ksek = Math.floor((ksek - kmin) * 60);
    const s = new Date(kyear, kmon - 1, kday, khr, kmin, ksek, 0);

    return s;
}

/** Liefert Grad (Degree) aus Radiant.
      @param r Radiant.
      @return Grad (Degree) aus Radiant. */
function DFromR(r: any) { return r * PI180; }

/** Liefert Radiant aus Grad (Degree).
    @param d Grad.
    @return Radiant aus Grad (Degree). */
function RFromD(d: any) { return d / PI180; }


/* Convert rectangular to polar coordinates. (1290 [1], 48)
   @param X x-Koordinate
   @param Y y-Koordinate
   @return new r-a coordinates. */
function RecToPol(X: any, Y: any) {
    // if (Y == 0.0) Y = Double.MIN_VALUE; // warum ?
    return { x: Math.sqrt(X * X + Y * Y), y: Angle(X, Y) };
}


// ---------------------------------------------------------------------
// -------------------- mathematische Hilfsroutinen --------------------
// ---------------------------------------------------------------------

/** Modulus function for floating point values, where we bring the given
    parameter to within the range of 0 to 360.
    @param d degree to mod
    @return Modulus function for Degree. */
function Mod360(x: any) {
    let d = x
    if (d >= 360.0) d -= 360.0;   // In most cases, our value is only slightly
    else if (d < 0.0) d += 360.0; // out of range, so we can test for it and
    // avoid the more complicated arithmetic.
    if ((d >= 0) && (d < 360.0)) return d;
    return d - Math.floor(d / 360.0) * 360.0;
}


/** Modulus function for floating point values, where we bring the given
    parameter to within the range of 0 to 2Pi.
    @param d randiant to mod
    @return Modulus function for Radiant. */
function Mod2PI(x: any) {
    let d = x
    if (d >= PI2) d -= PI2;   // In most cases, our value is only slightly
    else if (d < 0.0) d += PI2; // out of range, so we can test for it and
    // avoid the more complicated arithmetic.
    if ((d >= 0) && (d < PI2)) return d;
    return d - Math.floor(d / PI2) * PI2;
}


/** Berechnet Winkel zu Punkt (x,y), d.h. den ATAN(y/x), wobei Sonderfälle,
    wie ATAN(+/-infinity) ber&uuml;cksichtigt werden.
  Given an x and y coordinate, return the angle formed by a line from the
  origin to this coordinate. This is just converting from rectangular to
  polar coordinates; however, we don't determine the radius here. */
function Angle(x: any, y: any) {
    let a;

    if (x !== 0.0) {
        if (y !== 0.0) a = Math.atan(y / x);
        else a = (x < 0.0) ? Math.PI : 0.0;
    } else a = (y < 0.0) ? -Math.PI / 2 : Math.PI / 2;
    if (a < 0.0) a += Math.PI;
    if (y < 0.0) a += Math.PI;
    return a;
}


