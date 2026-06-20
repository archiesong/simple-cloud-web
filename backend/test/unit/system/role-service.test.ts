import { In } from 'typeorm';

import { BusinessException } from '../../../src/exception/business.exception';
import { MenuTypeEnum } from '../../../src/modules/system/entity/menu.entity';
import { RoleServiceImpl } from '../../../src/modules/system/service/impl/role.service.impl';

const makeService = () => {
  const service = new RoleServiceImpl();
  const role = {
    id: 1,
    menus: [],
  };
  const model = {
    findOne: jest.fn().mockResolvedValue(role),
    save: jest.fn().mockResolvedValue(role),
  };
  const menuModel = {
    find: jest.fn().mockResolvedValue([]),
  };

  (service as any).model = model;
  (service as any).menuModel = menuModel;

  return { service, model, menuModel, role };
};

describe('RoleServiceImpl.assignMenus', () => {
  it('saves unique menu and button ids to the role menu relation', async () => {
    const { service, model, menuModel, role } = makeService();
    const menus = [
      { id: 2, enabled: true, type: MenuTypeEnum.MENU },
      { id: 5, enabled: true, type: MenuTypeEnum.BUTTON },
    ];
    menuModel.find.mockResolvedValue(menus);

    await service.assignMenus({ id: '1', menuIds: ['2', '5', '5'] });

    expect(model.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
      relations: ['menus'],
    });
    expect(menuModel.find).toHaveBeenCalledWith({
      where: { id: In([2, 5]), enabled: true },
    });
    expect(role.menus).toEqual(menus);
    expect(model.save).toHaveBeenCalledWith(role);
  });

  it('clears role menu relation when menuIds is empty', async () => {
    const { service, model, menuModel, role } = makeService();
    role.menus = [{ id: 2 }];

    await service.assignMenus({ id: '1', menuIds: [] });

    expect(menuModel.find).not.toHaveBeenCalled();
    expect(role.menus).toEqual([]);
    expect(model.save).toHaveBeenCalledWith(role);
  });

  it('throws when role does not exist', async () => {
    const { service, model } = makeService();
    model.findOne.mockResolvedValue(null);

    await expect(service.assignMenus({ id: '404', menuIds: ['2'] })).rejects.toBeInstanceOf(
      BusinessException
    );
  });

  it('throws when any menu id does not exist or is disabled', async () => {
    const { service, menuModel } = makeService();
    menuModel.find.mockResolvedValue([{ id: 2, enabled: true }]);

    await expect(service.assignMenus({ id: '1', menuIds: ['2', '3'] })).rejects.toBeInstanceOf(
      BusinessException
    );
  });
});
