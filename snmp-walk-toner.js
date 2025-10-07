import snmp from 'net-snmp';

const ip = '192.168.85.168'; // Cambia por la IP de tu impresora
const community = 'public'; // Cambia si tu impresora usa otra comunidad
const oid = '1.3.6.1.2.1.43.11.1.1.9'; // Árbol de niveles de tóner (Printer-MIB)

const session = snmp.createSession(ip, community);

session.subtree(oid, (varbinds) => {
    varbinds.forEach((vb) => {
        // Mostrar solo los OID con valores reales de tóner
        if (vb.value !== null && vb.value !== -1 && vb.value !== 0 && vb.value !== '') {
            console.log(`${vb.oid} = ${vb.value}`);
        }
    });
}, (error) => {
    if (error) {
        console.error('Error SNMP walk:', error);
    }
    session.close();
});
