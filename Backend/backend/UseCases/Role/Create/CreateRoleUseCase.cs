using backend.DataAdapters.DataAdaptersFactory;
using backend.Entities;

namespace backend.UseCases.Role;

public class CreateRoleUseCase
{
    private readonly IRoleRepository _roleRepository;

    public CreateRoleUseCase(IRoleRepository roleRepository)
    {
        _roleRepository = roleRepository;
    }

    public async Task ExecuteAsync(string typeRole)
    {
        var role = new Entities.Role
        {
            Type_role = typeRole
        };

        await _roleRepository.AddAsync(role);
    }
}