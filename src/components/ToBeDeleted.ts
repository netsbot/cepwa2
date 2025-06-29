import {component} from "@lastolivegames/becsy";

/**
 * Marker component for entities that should be removed on the next frame
 * Used by DeleterSystem to identify entities scheduled for deletion
 */
@component export class ToBeDeleted {}