import * as THREE from "three";
const OrbitControls = require("three-orbit-controls")(THREE);
// import {SimulationDisplay} from "./SimulationDisplay";

interface AtomTypeMap {
    [atomTypeIndex: number]: {
        geometry: THREE.Geometry,
        material: THREE.Material
    };
}

export class SimulationDisplay3D {
    private canvasElement: HTMLCanvasElement;
    private scene: THREE.Scene;
    private camera: THREE.PerspectiveCamera;
    private renderer: THREE.Renderer;
    private controls: THREE.OrbitControls;

    private atomTypes: AtomTypeMap = {};
    private atomMeshes: THREE.Mesh[] = [];
    private edgeMeshes: THREE.Mesh[] = [];

    constructor(canvasElement: HTMLCanvasElement) {
        // super();
        this.canvasElement = canvasElement;

        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x33334c);

        this.camera = new THREE.PerspectiveCamera(
            75,
            this.canvasElement.clientWidth / this.canvasElement.clientHeight,
            0.1,
            1000
        );
        this.camera.position.z = 20;
        this.camera.lookAt(this.scene.position);

        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvasElement,
            antialias: true
        });
        this.renderer.setSize(this.canvasElement.clientWidth, this.canvasElement.clientHeight);

        // this.camera = new FreeCamera("camera1", new Vector3(0, 5, -10), this.scene);
        // this.camera = new ArcRotateCamera("ArcRotateCamera", 1, 0.8, 10, new Vector3(0, 0, 0), this.scene);
        // this.camera = new AnaglyphArcRotateCamera("aar_cam", -Math.PI/2, Math.PI/4, 20, Vector3.Zero(), 0.033, this.scene);

        this.scene.add(new THREE.AmbientLight(0x404040));
        const dirLight = new THREE.DirectionalLight(0xffffff, 1);
        dirLight.position.set(0, 100, 0);
        this.scene.add(dirLight);
        // const light = new THREE.HemisphereLight(0xeeeeee, 0x888888, 1);
        // light.position.set(0, 5, 0);
        // this.scene.add(light);
        // const pLight = new THREE.PointLight(0xffffff, 1);
        // pLight.position.set(10, 10, 10);
        // this.scene.add(pLight);

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.07;
        this.controls.rotateSpeed = 0.04;

        window.addEventListener("resize", () => this.resize());
        this.animate();
    }

    public addModel(model: {[k: string]: any}) {

        model["#species"].forEach((species: any) => {
            species["#atomType"].forEach((atomType: any) => {
                const geom = new THREE.SphereGeometry(0.5, 32, 32);
                const mat = new THREE.MeshPhongMaterial({
                    color: Math.random() * 0xffffff,
                    reflectivity: 0.5,
                    shininess: 46,
                });
                this.atomTypes[atomType.index] = { geometry: geom, material: mat };
            });
        });

        const atoms: any[] = model["#box"][0]["#leafList"];
        atoms.forEach((atom, i, arr) => {
            const atomType = this.atomTypes[atom["#type"].index];
            const atomMesh = new THREE.Mesh(atomType.geometry, atomType.material);
            atomMesh.position.fromArray(atom.position);
            this.atomMeshes[i] = atomMesh;
            this.scene.add(atomMesh);
        });

        const boxGeom = new THREE.Geometry();
        const edges: any[] = model["#box"][0]["#boundary"]["#shape"]["#edges"];
        edges.forEach((edge) => {
            const edgeVertices: any[] = edge["#vertices"];
            edgeVertices.forEach((vert) => {
                boxGeom.vertices.push(new THREE.Vector3(vert[0], vert[1], vert[2]));
            });
            // const edgeMesh = Mesh.CreateLines("box", edgeVertices.map((v) => new Vector3(v[0], v[1], v[2])), this.scene);
            // const edgeMesh = Mesh.CreateTube(
            //     `box`,
            //     edgeVertices.map((v) => new Vector3(v[0], v[1], v[2])),
            //     1,
            //     8,
            //     () => 0.01,
            //     Mesh.CAP_ALL,
            //     this.scene
            // );
            // edgeMesh.material = boxEdgeMat;
            // this.edgeMeshes.push(edgeMesh);
        });
        // const boxWireframe = new THREE.EdgesGeometry(boxGeom as BufferGeometry, 1);
        const boxMaterial = new THREE.LineBasicMaterial({
            color: 0xff2222,
            linewidth: 1
        });

        const boxMesh = new THREE.LineSegments(boxGeom, boxMaterial);
        this.scene.add(boxMesh);
    }

    public updatePositions(coords: number[][][]) {
        const box = coords[0];
        box.forEach((coord, i, arr) => {
            const mesh = this.atomMeshes[i];
            mesh.position.fromArray(coord);
        });
    }

    public pickCoordinates(x: number, y: number) {

    }

    public resize() {
        const w = this.canvasElement.clientWidth;
        const h = this.canvasElement.clientHeight;

        this.camera.aspect = w / h;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(w, h);
    }

    private animate = () => {
        requestAnimationFrame(this.animate);

        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }
}
