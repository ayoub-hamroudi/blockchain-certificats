// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

// Contrat permettant de gérer les diplômes sur la blockchain.
contract CertificateSystem {

    // Adresse de la direction (administrateur principal du système).
    address public direction;

    // Structure représentant les informations d'un certificat.
    struct Certificate {
        string id;
        string studentName;
        address studentAddress;
        string diplomaTitle;
        string mention;
        uint256 issueDate;
        bool teacherSigned;
        bool validated;
        address signedByTeacher;
        bool exists;
    }

    // Stockage des certificats à partir de leur identifiant.
    mapping(string => Certificate) private certificates;

    // Liste des enseignants autorisés dans le système.
    mapping(address => bool) public teachers;

    // Liste des étudiants autorisés dans le système.
    mapping(address => bool) public students;

    // Tableau contenant tous les identifiants des certificats créés.
    string[] private certificateIds;

    // Evénements utilisés pour notifier les actions importantes du contrat.
    event TeacherAdded(address teacher);
    event StudentAdded(address student);
    event CertificateGenerated(string id, string studentName, address studentAddress);
    event CertificateSigned(string id, address teacher);
    event CertificateValidated(string id);
    
    // Le constructeur initialise l'adresse de la direction lors du déploiement.
    constructor() {
        direction = msg.sender;
    }

    // Vérifie que la fonction est appelée uniquement par la direction.
    modifier onlyDirection() {
        require(msg.sender == direction, "Only direction can do this action");
        _;
    }

    // Vérifie que l'utilisateur est un enseignant autorisé.
    modifier onlyTeacher() {
        require(teachers[msg.sender], "Only teacher can do this action");
        _;
    }

    // Vérifie que l'utilisateur est un étudiant autorisé.
    modifier onlyStudent() {
        require(students[msg.sender], "Only student can do this action");
        _;
    }

    // Vérifie que le certificat existe avant d'exécuter la fonction.
    modifier certificateExists(string memory _id) {
        require(certificates[_id].exists, "Certificate does not exist");
        _;
    }

    // Ajoute un enseignant autorisé dans le système.
    function addTeacher(address _teacher) public onlyDirection {
        require(_teacher != address(0), "Invalid teacher address");
        teachers[_teacher] = true;
        emit TeacherAdded(_teacher);
    }

    // Ajoute un étudiant autorisé dans le système.
    function addStudent(address _student) public onlyDirection {
        require(_student != address(0), "Invalid student address");
        students[_student] = true;
        emit StudentAdded(_student);
    }

    // Génère un certificat et l'enregistre sur la blockchain.
    function generateCertificate(
        string memory _id,
        string memory _studentName,
        address _studentAddress,
        string memory _diplomaTitle,
        string memory _mention,
        uint256 _issueDate
    ) public onlyDirection {

        // Vérifie que le certificat n'existe pas déjà.
        require(!certificates[_id].exists, "Certificate ID already exists");

        // Vérifie la validité de l'adresse de l'étudiant.
        require(_studentAddress != address(0), "Invalid student address");

        // Vérifie que les champs obligatoires ne sont pas vides.
        require(bytes(_id).length > 0, "Certificate ID is required");
        require(bytes(_studentName).length > 0, "Student name is required");
        require(bytes(_diplomaTitle).length > 0, "Diploma title is required");

        // Création et enregistrement du certificat.
        certificates[_id] = Certificate({
            id: _id,
            studentName: _studentName,
            studentAddress: _studentAddress,
            diplomaTitle: _diplomaTitle,
            mention: _mention,
            issueDate: _issueDate,
            teacherSigned: false,
            validated: false,
            signedByTeacher: address(0),
            exists: true
        });

        // Ajout de l'identifiant dans la liste des certificats.
        certificateIds.push(_id);

        // Emission d'un événement pour notifier la création.
        emit CertificateGenerated(_id, _studentName, _studentAddress);
    }

    // Permet à un enseignant de signer un certificat.
    function signCertificate(string memory _id)
        public
        onlyTeacher
        certificateExists(_id)
    {
        // Vérifie que le certificat n'a pas déjà été signé.
        require(!certificates[_id].teacherSigned, "Certificate already signed");

        certificates[_id].teacherSigned = true;
        certificates[_id].signedByTeacher = msg.sender;

        emit CertificateSigned(_id, msg.sender);
    }

    // Permet à la direction de valider définitivement un certificat.
    function validateCertificate(string memory _id)
        public
        onlyDirection
        certificateExists(_id)
    {
        // Vérifie que l'enseignant a signé avant validation.
        require(certificates[_id].teacherSigned, "Teacher must sign first");

        // Vérifie que le certificat n'est pas déjà validé.
        require(!certificates[_id].validated, "Certificate already validated");

        certificates[_id].validated = true;

        emit CertificateValidated(_id);
    }

    // Vérifie publiquement si un certificat est valide.
    function verifyCertificate(string memory _id)
        public
        view
        certificateExists(_id)
        returns (bool)
    {
        return certificates[_id].validated;
    }

    // Retourne toutes les informations d'un certificat.
    function getCertificate(string memory _id)
        public
        view
        certificateExists(_id)
        returns (
            string memory id,
            string memory studentName,
            address studentAddress,
            string memory diplomaTitle,
            string memory mention,
            uint256 issueDate,
            bool teacherSigned,
            bool validated,
            address signedByTeacher
        )
    {
        Certificate memory cert = certificates[_id];

        return (
            cert.id,
            cert.studentName,
            cert.studentAddress,
            cert.diplomaTitle,
            cert.mention,
            cert.issueDate,
            cert.teacherSigned,
            cert.validated,
            cert.signedByTeacher
        );
    }

    // Retourne le rôle de l'utilisateur connecté.
    function getMyRole(address _user) public view returns (string memory) {
        if (_user == direction) {
            return "direction";
        }
        if (teachers[_user]) {
            return "teacher";
        }
        if (students[_user]) {
            return "student";
        }
        return "visitor";
    }

    // Retourne la liste de tous les certificats enregistrés.
    function getAllCertificateIds() public view returns (string[] memory) {
        return certificateIds;
    }

    // Permet à l'étudiant ou aux acteurs autorisés de consulter un certificat.
    function getStudentCertificate(string memory _id)
        public
        view
        certificateExists(_id)
        returns (
            string memory,
            string memory,
            string memory,
            string memory,
            bool,
            bool
        )
    {
        Certificate memory cert = certificates[_id];

        // Vérifie que l'utilisateur est autorisé à voir ce certificat.
        require(
            msg.sender == cert.studentAddress || msg.sender == direction || teachers[msg.sender],
            "Not authorized to view this certificate"
        );

        return (
            cert.id,
            cert.studentName,
            cert.diplomaTitle,
            cert.mention,
            cert.teacherSigned,
            cert.validated
        );
    }
}