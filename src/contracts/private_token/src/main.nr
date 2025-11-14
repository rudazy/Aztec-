use dep::aztec::macros::aztec;

#[aztec]
pub contract Token {
    use dep::aztec::{
        macros::{functions::{external, initializer}, storage::storage},
    };
    use dep::aztec::protocol_types::address::AztecAddress;
    use dep::aztec::state_vars::PublicMutable;

    #[storage]
    struct Storage<Context> {
        admin: PublicMutable<AztecAddress, Context>,
        total_supply: PublicMutable<Field, Context>,
    }

    #[external("public")]
    #[initializer]
    fn constructor(admin: AztecAddress, initial_supply: Field) {
        storage.admin.write(admin);
        storage.total_supply.write(initial_supply);
    }

    #[external("utility")]
    unconstrained fn get_total_supply() -> Field {
        storage.total_supply.read()
    }

    #[external("utility")]
    unconstrained fn get_admin() -> AztecAddress {
        storage.admin.read()
    }
}
