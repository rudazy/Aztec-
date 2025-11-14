use dep::aztec::macros::aztec;

#[aztec]
pub contract PrivateOrderBook {
    use dep::aztec::{
        macros::{functions::{external, initializer}, storage::storage},
    };
    use dep::aztec::protocol_types::address::AztecAddress;
    use dep::aztec::state_vars::PublicMutable;

    #[storage]
    struct Storage<Context> {
        admin: PublicMutable<AztecAddress, Context>,
        total_volume: PublicMutable<Field, Context>,
    }

    #[external("public")]
    #[initializer]
    fn constructor(admin: AztecAddress) {
        storage.admin.write(admin);
        storage.total_volume.write(0);
    }

    #[external("utility")]
    unconstrained fn get_admin() -> AztecAddress {
        storage.admin.read()
    }

    #[external("utility")]
    unconstrained fn get_total_volume() -> Field {
        storage.total_volume.read()
    }
}
