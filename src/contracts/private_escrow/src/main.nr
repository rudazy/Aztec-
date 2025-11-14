use dep::aztec::macros::aztec;

#[aztec]
pub contract PrivateEscrow {
    use dep::aztec::{
        macros::{functions::{external, initializer}, storage::storage},
    };
    use dep::aztec::protocol_types::address::AztecAddress;
    use dep::aztec::state_vars::PublicMutable;

    #[storage]
    struct Storage<Context> {
        admin: PublicMutable<AztecAddress, Context>,
    }

    #[external("public")]
    #[initializer]
    fn constructor(admin: AztecAddress) {
        storage.admin.write(admin);
    }

    #[external("utility")]
    unconstrained fn get_admin() -> AztecAddress {
        storage.admin.read()
    }
}
