import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guard/auth.guard'; 
import { RolesGuard } from '../auth/guard/roles.guard'; 
import { AdminService } from './admin.service'; 
import { Roles } from '../decorators/roles.decorators'; 
import { Role } from 'src/users/roles.enum'; 

@Controller('admin')
@UseGuards(AuthGuard, RolesGuard) // Aplica ambos guards
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('graph')
  @Roles(Role.Admin) // Usa el decorador de roles para especificar que solo los administradores pueden acceder
  async getGraphData() {
    return this.adminService.getStats(); // Llama al método de servicio para obtener datos
  }
}
