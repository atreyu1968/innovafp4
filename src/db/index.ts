import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './schema';

// Crear pool de conexiones MySQL
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10,
  idleTimeout: 60000,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  ssl: process.env.DB_SSL === 'true' ? {
    rejectUnauthorized: false
  } : undefined
});

// Crear instancia de Drizzle con el esquema
export const db = drizzle(pool, { schema, mode: 'default' });

// Función para inicializar la base de datos
export async function initDatabase() {
  try {
    // Verificar conexión
    await pool.query('SELECT 1');
    console.log('✅ Base de datos conectada correctamente');

    // Verificar tablas
    const [rows] = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = ?
    `, [process.env.DB_NAME]);

    const tables = (rows as any[]).map(row => row.table_name);
    const requiredTables = [
      'users',
      'academic_years',
      'subnets',
      'centers',
      'center_types',
      'families',
      'forms',
      'form_responses',
      'dashboards',
      'reports',
      'messages',
      'settings'
    ];

    const missingTables = requiredTables.filter(table => !tables.includes(table));
    
    if (missingTables.length > 0) {
      console.warn('⚠️ Tablas faltantes:', missingTables.join(', '));
      console.log('ℹ️ Ejecuta npm run db:push para crear las tablas faltantes');
    } else {
      console.log('✅ Todas las tablas están creadas correctamente');
    }

  } catch (error) {
    console.error('❌ Error al inicializar la base de datos:', error);
    throw error;
  }
}