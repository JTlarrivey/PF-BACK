import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guard/auth.guard'; // Asegúrate de que la ruta sea correcta
import { RolesGuard } from '../auth/roles.guard'; // Asegúrate de que la ruta sea correcta
import { AdminService } from './admin.service'; // Asegúrate de importar el servicio
import { Roles } from '../decorators/roles.decorators'; // Ajusta la ruta según tu estructura
import { Role } from 'src/users/roles.enum'; // Asegúrate de importar tu enum de roles

@Controller('admin')

export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('graph')
  @Roles(Role.Admin) // Usa el decorador de roles para especificar que solo los administradores pueden acceder
  @UseGuards(AuthGuard, RolesGuard) // Aplica ambos guards
  async getGraphData() {
    return this.adminService.getStats(); // Llama al método de servicio para obtener datos
  }
}
