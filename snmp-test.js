import snmp from 'net-snmp';

const ip = '192.168.85.113'; // Cambia por la IP de tu impresora
const community = 'public'; // Cambia si tu impresora usa otra comunidad
const oid = '1.3.6.1.2.1.43.11.1.1.9.1.1'; // OID estándar para obtener información del sistema

const session = snmp.createSession(ip, community);

session.get([oid], (error, varbinds) => {
    if (error) {
        console.error('Error SNMP:', error);
    } else {
        console.log('Respuesta SNMP:', varbinds[0]?.value?.toString());
    }
    session.close();
});
